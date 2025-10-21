# 🔧 Backend - Instruções de Implementação

## Estrutura do Backend Node.js

```
backend/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Animal.js
│   │   ├── Photo.js
│   │   ├── Reward.js
│   │   ├── UserReward.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── animal.routes.js
│   │   ├── photo.routes.js
│   │   ├── reward.routes.js
│   │   └── payment.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── animal.controller.js
│   │   ├── photo.controller.js
│   │   ├── reward.controller.js
│   │   └── payment.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   └── upload.middleware.js
│   ├── services/
│   │   ├── email.service.js
│   │   ├── pix.service.js
│   │   └── pagseguro.service.js
│   ├── utils/
│   │   ├── jwt.util.js
│   │   └── validators.util.js
│   ├── config/
│   │   └── database.js
│   └── app.js
├── .env
├── .env.example
├── package.json
└── server.js
```

## 1. Configuração Inicial

### package.json

```json
{
  "name": "patas-solidarias-backend",
  "version": "1.0.0",
  "description": "Backend API para Patas Solidárias",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.7",
    "qrcode": "^1.5.3",
    "axios": "^1.6.2",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

### .env.example

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/patas-solidarias

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
EMAIL_FROM=Patas Solidárias <noreply@patassolidarias.com>

# PIX
PIX_KEY=sua_chave_pix@example.com
PIX_API_URL=https://api.provedor-pix.com
PIX_TOKEN=seu_token_pix

# PagSeguro
PAGSEGURO_EMAIL=seu_email@pagseguro.com
PAGSEGURO_TOKEN=seu_token_pagseguro
PAGSEGURO_ENV=sandbox

# URLs
FRONTEND_URL=http://localhost:4200
BACKEND_URL=http://localhost:3000

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 2. Models (Mongoose)

### User.js

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  telefone: { type: String, required: true },
  rg: { type: String, required: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isDoador: { type: Boolean, default: false },
  emailVerificado: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpire: Date,
  assinaturaAtiva: {
    tipo: { type: String, enum: ['mensal', 'avulso'] },
    valorMensal: Number,
    dataInicio: Date,
    dataProximoPagamento: Date,
    status: { type: String, enum: ['ativa', 'cancelada', 'suspensa'] },
    assinaturaId: String
  },
  dataCriacao: { type: Date, default: Date.now }
});

// Hash senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 12);
  next();
});

// Comparar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.senha);
};

module.exports = mongoose.model('User', userSchema);
```

### Animal.js

```javascript
const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['cachorro', 'gato', 'outro'], required: true },
  descricao: { type: String, required: true },
  imagemPrincipal: { type: String, required: true },
  idade: String,
  dataCadastro: { type: Date, default: Date.now },
  ativo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Animal', animalSchema);
```

### Photo.js

```javascript
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  urlImagem: { type: String, required: true },
  animaisAssociados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
  dataEnvio: { type: Date, default: Date.now },
  descricao: String,
  legenda: String,
  usuariosReceberam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  mes: { type: Number, required: true },
  ano: { type: Number, required: true }
});

module.exports = mongoose.model('Photo', photoSchema);
```

### Reward.js

```javascript
const mongoose = require('mongoose');

const rewardScheduleSchema = new mongoose.Schema({
  data: { type: Date, required: true },
  horarioInicio: { type: String, required: true },
  horarioFim: { type: String, required: true },
  vagasDisponiveis: { type: Number, required: true },
  vagasOcupadas: { type: Number, default: 0 }
});

const rewardSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  imagemUrl: { type: String, required: true },
  mes: { type: Number, required: true },
  ano: { type: Number, required: true },
  dataDisponibilidade: { type: Date, default: Date.now },
  horariosRetirada: [rewardScheduleSchema],
  quantidadeDisponivel: { type: Number, required: true },
  ativo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Reward', rewardSchema);
```

### UserReward.js

```javascript
const mongoose = require('mongoose');

const userRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  dataElegibilidade: { type: Date, required: true },
  resgatado: { type: Boolean, default: false },
  dataResgate: Date,
  horarioRetiradaSelecionado: {
    data: Date,
    horario: String
  }
});

module.exports = mongoose.model('UserReward', userRewardSchema);
```

### Payment.js

```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, enum: ['pix', 'assinatura'], required: true },
  valor: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'recusado', 'cancelado'], 
    default: 'pendente' 
  },
  dataCriacao: { type: Date, default: Date.now },
  dataProcessamento: Date,
  pixData: {
    qrCode: String,
    qrCodeBase64: String,
    copiaCola: String,
    txId: String
  },
  assinaturaData: {
    plataforma: String,
    assinaturaId: String,
    proximaCobranca: Date
  },
  descricao: String
});

module.exports = mongoose.model('Payment', paymentSchema);
```

## 3. Rotas Principais

### auth.routes.js

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');

router.post('/register', [
  body('nome').trim().isLength({ min: 3 }),
  body('email').isEmail().normalizeEmail(),
  body('telefone').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/),
  body('rg').matches(/^\d{2}\.\d{3}\.\d{3}-\d{1}$/),
  body('senha').isLength({ min: 6 })
], authController.register);

router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
```

## 4. Controllers Essenciais

### auth.controller.js (Exemplo)

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/email.service');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, telefone, rg, senha } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criar token de verificação
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      telefone,
      rg,
      senha,
      emailVerificationToken
    });

    // Enviar email de verificação
    await emailService.sendVerificationEmail(user.email, emailVerificationToken);

    res.status(201).json({ 
      message: 'Usuário criado! Verifique seu email para confirmar sua conta.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(senha))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (!user.emailVerificado) {
      return res.status(401).json({ message: 'Por favor, verifique seu email primeiro' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      user: {
        _id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        isDoador: user.isDoador
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};
```

## 5. Services

### email.service.js

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Confirme seu email - Patas Solidárias',
    html: `
      <h1>Bem-vindo ao Patas Solidárias!</h1>
      <p>Clique no link abaixo para confirmar seu email:</p>
      <a href="${verificationUrl}">Confirmar Email</a>
    `
  });
};

exports.sendPhotoNotification = async (email, nome) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Nova foto dos pets! 🐾',
    html: `
      <h2>Olá ${nome}!</h2>
      <p>Uma nova foto dos nossos pets foi enviada para você!</p>
      <p>Acesse sua conta para visualizar: ${process.env.FRONTEND_URL}/dashboard/meus-brindes</p>
    `
  });
};

exports.sendRewardAvailableNotification = async (email, nome, rewardName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Brinde disponível! 🎁',
    html: `
      <h2>Parabéns ${nome}!</h2>
      <p>Você tem um novo brinde disponível: <strong>${rewardName}</strong></p>
      <p>Acesse sua conta para agendar a retirada: ${process.env.FRONTEND_URL}/dashboard/meus-brindes</p>
    `
  });
};
```

### pix.service.js

```javascript
const QRCode = require('qrcode');
const axios = require('axios');

exports.generatePixPayment = async (valor, descricao) => {
  try {
    // Chamar API do provedor PIX para gerar cobrança
    const response = await axios.post(
      `${process.env.PIX_API_URL}/cobranças`,
      {
        valor: valor,
        chave: process.env.PIX_KEY,
        descricao: descricao
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PIX_TOKEN}`
        }
      }
    );

    const { txId, copiaCola } = response.data;

    // Gerar QR Code
    const qrCodeBase64 = await QRCode.toDataURL(copiaCola);
    const qrCode = await QRCode.toString(copiaCola, { type: 'svg' });

    return {
      txId,
      copiaCola,
      qrCode,
      qrCodeBase64
    };
  } catch (error) {
    throw new Error('Erro ao gerar pagamento PIX: ' + error.message);
  }
};

exports.checkPixPaymentStatus = async (txId) => {
  try {
    const response = await axios.get(
      `${process.env.PIX_API_URL}/cobranças/${txId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PIX_TOKEN}`
        }
      }
    );

    return response.data.status; // 'pendente', 'aprovado', 'cancelado'
  } catch (error) {
    throw new Error('Erro ao verificar status do pagamento');
  }
};
```

### pagseguro.service.js

```javascript
const axios = require('axios');

exports.createSubscription = async (email, valorMensal) => {
  try {
    const pagseguroUrl = process.env.PAGSEGURO_ENV === 'production'
      ? 'https://ws.pagseguro.uol.com.br'
      : 'https://ws.sandbox.pagseguro.uol.com.br';

    const response = await axios.post(
      `${pagseguroUrl}/v2/pre-approvals/request`,
      {
        email: process.env.PAGSEGURO_EMAIL,
        token: process.env.PAGSEGURO_TOKEN,
        reference: `ASSINATURA_${Date.now()}`,
        sender: {
          email: email
        },
        preApproval: {
          name: 'Apoio Mensal Patas Solidárias',
          charge: 'auto',
          period: 'monthly',
          amountPerPayment: valorMensal.toFixed(2)
        }
      }
    );

    return response.data.code; // Código da assinatura PagSeguro
  } catch (error) {
    throw new Error('Erro ao criar assinatura: ' + error.message);
  }
};

exports.cancelSubscription = async (assinaturaId) => {
  try {
    const pagseguroUrl = process.env.PAGSEGURO_ENV === 'production'
      ? 'https://ws.pagseguro.uol.com.br'
      : 'https://ws.sandbox.pagseguro.uol.com.br';

    await axios.put(
      `${pagseguroUrl}/v2/pre-approvals/${assinaturaId}/cancel`,
      {},
      {
        params: {
          email: process.env.PAGSEGURO_EMAIL,
          token: process.env.PAGSEGURO_TOKEN
        }
      }
    );

    return true;
  } catch (error) {
    throw new Error('Erro ao cancelar assinatura');
  }
};
```

## 6. Middleware

### auth.middleware.js

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-senha');

    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Você não tem permissão para essa ação' });
    }
    next();
  };
};
```

## 7. Jobs Automatizados

Criar um scheduler para enviar fotos mensalmente e verificar elegibilidade de brindes:

```javascript
// jobs/scheduler.js
const cron = require('node-cron');
const User = require('../models/User');
const UserReward = require('../models/UserReward');
const Reward = require('../models/Reward');
const emailService = require('../services/email.service');

// Executar todo dia 1 às 9h
cron.schedule('0 9 1 * *', async () => {
  console.log('Verificando elegibilidade de brindes...');
  
  const users = await User.find({ isDoador: true, 'assinaturaAtiva.status': 'ativa' });
  const currentReward = await Reward.findOne({ 
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    ativo: true
  });

  if (!currentReward) return;

  for (const user of users) {
    const monthsSinceStart = calculateMonthsDifference(
      user.assinaturaAtiva.dataInicio,
      new Date()
    );

    if (monthsSinceStart > 0 && monthsSinceStart % 3 === 0) {
      // Usuário elegível para brinde
      await UserReward.create({
        userId: user._id,
        rewardId: currentReward._id,
        dataElegibilidade: new Date()
      });

      // Enviar email
      await emailService.sendRewardAvailableNotification(
        user.email,
        user.nome,
        currentReward.nome
      );
    }
  }
});

function calculateMonthsDifference(startDate, endDate) {
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
         (endDate.getMonth() - startDate.getMonth());
}
```

## 8. Server.js Principal

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/animals', require('./src/routes/animal.routes'));
app.use('/api/photos', require('./src/routes/photo.routes'));
app.use('/api/rewards', require('./src/routes/reward.routes'));
app.use('/api/payments', require('./src/routes/payment.routes'));

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

## 9. Deploy

### Heroku
```bash
heroku create patas-solidarias-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongo_uri
# Adicionar outras variáveis de ambiente
git push heroku main
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

Com essa estrutura, o backend estará pronto para suportar todas as funcionalidades do frontend Angular!
