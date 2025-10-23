# 🚀 Guia Rápido de Desenvolvimento

## Para o Desenvolvedor Backend

### 📦 Stack Recomendado

```bash
# Dependências principais
npm install express mongoose bcryptjs jsonwebtoken
npm install multer cloudinary nodemailer handlebars
npm install bull redis cors dotenv

# Dev dependencies
npm install --save-dev nodemon typescript @types/node
```

### 🗄️ Schemas MongoDB (Exemplo)

```javascript
// models/Animal.js
const animalSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['Gato', 'Cachorro', 'Outro'],
    required: true 
  },
  descricao: { type: String, required: true },
  fotoPerfilId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Foto' 
  },
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now }
});

// models/Foto.js
const fotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  descricao: String,
  animalIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Animal' 
  }],
  emailEnviado: { type: Boolean, default: false },
  dataDisparo: Date,
  adicionadaPor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  dataCadastro: { type: Date, default: Date.now }
});

// models/Brinde.js
const brindeSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['Adesivo', 'Chaveiro', 'Caneca', 'Camiseta', 'Outro'] 
  },
  foto: { type: String, required: true },
  visivel: { type: Boolean, default: false },
  ordem: { type: Number, min: 1, max: 4 },
  ativo: { type: Boolean, default: true },
  dataCadastro: { type: Date, default: Date.now }
});
```

### 🔐 Middleware de Autenticação

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      _id: decoded.userId,
      'tokens.token': token 
    });
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor, autentique-se.' });
  }
};

// middleware/admin.js
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas administradores.' 
    });
  }
  next();
};
```

### 📤 Exemplo de Upload (Cloudinary)

```javascript
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// routes/fotos.js
router.post('/batch', authMiddleware, adminMiddleware, upload.array('fotos'), async (req, res) => {
  try {
    const { descricoes, animaisIds, enviarEmail } = req.body;
    
    // Upload para Cloudinary
    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, {
        folder: 'patas-solidarias/fotos'
      })
    );
    
    const uploadResults = await Promise.all(uploadPromises);
    
    // Criar documentos no banco
    const fotosDocs = uploadResults.map((result, index) => ({
      url: result.secure_url,
      descricao: JSON.parse(descricoes)[index],
      animalIds: JSON.parse(animaisIds)[index],
      emailEnviado: false,
      adicionadaPor: req.user._id
    }));
    
    const fotos = await Foto.insertMany(fotosDocs);
    
    // Disparar email se solicitado
    if (enviarEmail === 'true') {
      await emailQueue.add('novas-fotos', { fotos });
    }
    
    res.status(201).json({
      message: 'Fotos adicionadas com sucesso',
      fotos
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 📧 Sistema de Emails (Exemplo)

```javascript
// queues/emailQueue.js
const Bull = require('bull');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

const emailQueue = new Bull('emails', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

emailQueue.process('novas-fotos', async (job) => {
  const { fotos } = job.data;
  
  // Buscar todos usuários
  const usuarios = await User.find({ emailVerificado: true });
  
  // Template
  const templateFile = fs.readFileSync(
    './templates/novas-fotos.hbs', 
    'utf-8'
  );
  const template = handlebars.compile(templateFile);
  
  // Agrupar fotos por animal
  const fotosPorAnimal = {}; // lógica de agrupamento
  
  // Enviar para cada usuário
  for (const usuario of usuarios) {
    const html = template({
      nome: usuario.nome,
      animais: fotosPorAnimal,
      link: `${process.env.FRONTEND_URL}/conta/fotos`
    });
    
    await transporter.sendMail({
      from: 'Patas Solidárias <noreply@patassolidarias.com>',
      to: usuario.email,
      subject: '🐾 Novas fotos dos nossos pets!',
      html
    });
  }
  
  // Marcar fotos como enviadas
  await Foto.updateMany(
    { _id: { $in: fotos.map(f => f._id) } },
    { emailEnviado: true, dataDisparo: new Date() }
  );
});

module.exports = emailQueue;
```

### 📊 Endpoint de Estatísticas (Exemplo)

```javascript
// routes/admin/stats.js
router.get('/assinaturas', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Aggregation para estatísticas
    const stats = await User.aggregate([
      {
        $match: {
          'assinaturaAtiva.status': { $in: ['ativa', 'cancelada'] }
        }
      },
      {
        $group: {
          _id: null,
          totalAssinantes: { $sum: 1 },
          assinantesAtivos: {
            $sum: {
              $cond: [
                { $eq: ['$assinaturaAtiva.status', 'ativa'] },
                1,
                0
              ]
            }
          },
          receitaMensal: {
            $sum: {
              $cond: [
                { $eq: ['$assinaturaAtiva.status', 'ativa'] },
                '$assinaturaAtiva.valor',
                0
              ]
            }
          }
        }
      }
    ]);
    
    // Por mês
    const porMes = await User.aggregate([
      {
        $match: { 'assinaturaAtiva.dataInicio': { $exists: true } }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$assinaturaAtiva.dataInicio'
            }
          },
          novos: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      ...stats[0],
      porMes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Para o Desenvolvedor Frontend

### 🔌 Conectar com Backend

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // URL do backend
  useMockData: false // Desabilitar mock quando backend estiver pronto
};
```

### 🎨 Adicionar Editor Rico

```bash
# Instalar Quill
npm install ngx-quill quill

# Ou TinyMCE
npm install @tinymce/tinymce-angular
```

```typescript
// editor-post.component.ts
import { QuillModule } from 'ngx-quill';

@Component({
  imports: [QuillModule],
  // ...
})
export class EditorPostComponent {
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image']
    ]
  };
  
  conteudo = '';
}
```

```html
<!-- Template -->
<quill-editor 
  [(ngModel)]="conteudo"
  [modules]="editorModules">
</quill-editor>
```

### 📊 Adicionar Gráficos

```bash
npm install ng2-charts chart.js
```

```typescript
// dashboard.component.ts
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  imports: [BaseChartDirective],
  // ...
})
export class DashboardComponent {
  lineChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    datasets: [
      {
        data: [10, 15, 12, 20, 18],
        label: 'Novos Assinantes',
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)'
      }
    ]
  };
}
```

### 🔔 Notificações Toast

```bash
npm install ngx-toastr
```

```typescript
// animal.service.ts
import { ToastrService } from 'ngx-toastr';

constructor(
  private http: HttpClient,
  private toastr: ToastrService
) {}

createAnimal(data: FormData): Observable<Animal> {
  return this.http.post<Animal>(`${this.apiUrl}`, data).pipe(
    tap(() => this.toastr.success('Animal criado com sucesso!')),
    catchError(error => {
      this.toastr.error('Erro ao criar animal');
      throw error;
    })
  );
}
```

---

## 🧪 Testes

### Backend (Jest)

```javascript
// tests/animals.test.js
describe('Animals API', () => {
  test('POST /api/animals - criar animal', async () => {
    const res = await request(app)
      .post('/api/animals')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nome', 'Tigrão')
      .field('tipo', 'Gato')
      .field('descricao', 'Gato carinhoso')
      .attach('foto', './tests/fixtures/gato.jpg')
      .expect(201);
    
    expect(res.body.animal).toHaveProperty('_id');
    expect(res.body.animal.nome).toBe('Tigrão');
  });
});
```

### Frontend (Jasmine)

```typescript
// animal.service.spec.ts
describe('AnimalService', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnimalService]
    });
    
    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('deve buscar animais ativos', () => {
    const mockAnimals = [
      { id: '1', nome: 'Tigrão', tipo: 'Gato' }
    ];
    
    service.getActiveAnimals().subscribe(animals => {
      expect(animals.length).toBe(1);
      expect(animals[0].nome).toBe('Tigrão');
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/animals/active`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnimals);
  });
});
```

---

## 📝 Variáveis de Ambiente

### Backend (.env)

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/patas-solidarias

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@patassolidarias.com
EMAIL_PASS=senha_app_gmail

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
FRONTEND_URL=http://localhost:4200

# Mercado Pago (para pagamentos)
MP_PUBLIC_KEY=seu_public_key
MP_ACCESS_TOKEN=seu_access_token
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  useMockData: false,
  
  // Mercado Pago
  mercadoPagoPublicKey: 'TEST-xxx-xxx',
  
  // Cloudinary (para preview antes de upload)
  cloudinaryCloudName: 'seu_cloud_name'
};
```

---

## 🚀 Deploy

### Backend (Heroku/Railway)

```bash
# Procfile
web: node server.js

# Configurar variáveis de ambiente no painel
# Adicionar add-ons: MongoDB Atlas, Redis Cloud
```

### Frontend (Vercel/Netlify)

```bash
# Build command
ng build

# Output directory
dist/patasolidarias/browser

# Configurar variáveis de ambiente
API_URL=https://api.patassolidarias.com
```

---

## 🔍 Debug

### Backend

```javascript
// Adicione logging
const morgan = require('morgan');
app.use(morgan('dev'));

// Debug de erros
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  res.status(500).json({ 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

### Frontend

```typescript
// Interceptor para log de requests
import { HttpInterceptor } from '@angular/common/http';

export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('REQUEST:', req.method, req.url);
    
    return next.handle(req).pipe(
      tap(res => console.log('RESPONSE:', res)),
      catchError(err => {
        console.error('ERROR:', err);
        return throwError(() => err);
      })
    );
  }
}
```

---

## ✅ Checklist de Deploy

### Backend
- [ ] Todas variáveis de ambiente configuradas
- [ ] MongoDB Atlas configurado
- [ ] Redis Cloud configurado
- [ ] Cloudinary configurado
- [ ] Email service configurado
- [ ] CORS configurado para frontend
- [ ] Rate limiting ativo
- [ ] Logs configurados
- [ ] Health check endpoint (`/health`)
- [ ] Backup automático do banco

### Frontend
- [ ] `environment.prod.ts` configurado
- [ ] Build de produção testado
- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS ativo
- [ ] CDN configurado (opcional)
- [ ] Analytics configurado (Google Analytics)
- [ ] SEO meta tags
- [ ] Favicon e imagens otimizadas

---

**Boa sorte no desenvolvimento! 🚀**
