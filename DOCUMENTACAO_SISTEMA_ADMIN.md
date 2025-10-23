# 📋 Documentação Completa do Sistema Administrativo - Patas Solidárias

## 🎯 Visão Geral

Sistema completo de gerenciamento administrativo para o projeto Patas Solidárias da UTFPR-MD, incluindo:
- Gerenciamento de animais e fotos
- Sistema de brindes resgatáveis
- Editor de posts com newsletter
- Dashboard de assinaturas
- Sistema de convites para admins
- Agendamento de retiradas

---

## 📁 Estrutura do Projeto

```
src/app/
├── components/
│   ├── admin/
│   │   ├── auth/
│   │   │   └── admin-login/              # Login separado (/admin/login)
│   │   ├── dashboard/                    # Dashboard principal
│   │   ├── animais/
│   │   │   ├── lista-animais/            # CRUD de animais
│   │   │   └── form-animal/              # Formulário criar/editar
│   │   ├── fotos/
│   │   │   ├── lista-fotos/              # Galeria de fotos
│   │   │   └── upload-fotos/             # Upload múltiplo com email
│   │   ├── brindes/
│   │   │   ├── lista-brindes/            # CRUD de brindes
│   │   │   └── gerenciar-brindes/        # Selecionar visíveis (4 máx)
│   │   ├── posts/
│   │   │   ├── lista-posts/              # Lista de posts/newsletters
│   │   │   └── editor-post/              # Editor rico com imagens
│   │   ├── assinantes/                   # Relatórios e estatísticas
│   │   ├── resgates/                     # Gerenciar resgates de brindes
│   │   └── admins/                       # Gerenciar convites e permissões
│   └── user/                             # Área do usuário regular
├── service/
│   ├── animal.service.ts                 # CRUD + métodos especiais
│   ├── foto.service.ts                   # Upload batch + notificações
│   ├── brinde.service.ts                 # CRUD + disponibilidade
│   ├── post.service.ts                   # Newsletter + templates
│   ├── resgate.service.ts                # Agendamentos + config
│   └── admin.service.ts                  # Convites + permissões
├── model/
│   ├── animal.model.ts                   # Animal + Foto
│   ├── brinde.model.ts                   # Brinde + ConfigRetirada + Resgate
│   ├── post.model.ts                     # Post + Template + EmailPost
│   └── admin.model.ts                    # Convite + Stats + Dashboard
└── guards/
    ├── auth.guard.ts                     # Verifica autenticação
    └── admin.guard.ts                    # Verifica role='admin'
```

---

## 🔐 Sistema de Autenticação

### Login Separado

**Rota:** `/admin/login`

**Componente:** `AdminLoginComponent`

**Características:**
- Design roxo gradiente (diferente do login regular)
- Valida se `user.role === 'admin'`
- Redireciona para `/admin` após sucesso
- Redireciona para `/admin/login` se não autenticado

**Guards:**
```typescript
// app.routes.ts
{
  path: 'admin',
  children: [
    { path: 'login', component: AdminLoginComponent }, // Público
    { 
      path: '', 
      canActivate: [authGuard, adminGuard],
      loadChildren: () => import('./routes/admin.routes')
    }
  ]
}
```

### Acesso Dual

**Admins podem:**
- Acessar área de cliente (`/conta/*`)
- Acessar área administrativa (`/admin/*`)
- Ver botões especiais no header e sidebar

**Indicadores visuais:**
```html
<!-- header.component.html -->
@if (isAdmin) {
  <a class="dropdown-item admin-item" (click)="navigateTo('/admin')">
    <i class="fas fa-shield-alt"></i>
    <span>Painel Administrativo</span>
  </a>
}
```

---

## 🐾 Sistema de Animais

### Modelos de Dados

```typescript
interface Animal {
  id: string;
  nome: string;
  tipo: 'Gato' | 'Cachorro' | 'Outro';
  descricao: string;
  fotoPerfilId?: string;
  fotoPerfil?: string; // URL
  fotos?: FotoAnimal[];
  dataCadastro: Date;
  ativo: boolean;
}

interface FotoAnimal {
  id: string;
  animalIds: string[]; // Múltiplos animais por foto
  url: string;
  descricao: string;
  disparadaEmail: boolean;
  dataDisparo?: Date;
}
```

### Funcionalidades

#### 1. Cadastrar Animal (Admin)

**Endpoint:** `POST /api/animals`

**Dados:**
```typescript
{
  nome: string;
  tipo: 'Gato' | 'Cachorro' | 'Outro';
  descricao: string;
  fotoPerfilFile?: File; // Upload da foto
}
```

**Fluxo:**
1. Admin preenche formulário com nome, tipo, descrição
2. Upload de foto de perfil (opcional)
3. Foto de perfil automaticamente adicionada à galeria
4. Animal criado e associado à foto

#### 2. Editar Animal (Admin)

**Endpoint:** `PUT /api/animals/:id`

**Funcionalidades:**
- Editar nome, tipo, descrição
- **Trocar foto de perfil** selecionando outra foto já associada ao animal
- Ativar/desativar animal

**Componente:** `FormAnimalComponent`

#### 3. Adicionar Fotos ao Animal (Admin)

**Endpoint:** `POST /api/fotos/batch`

**Características especiais:**
- Upload múltiplo (várias fotos de uma vez)
- Cada foto tem descrição
- **Uma foto pode ter múltiplos animais**
- **Disparar email** é opcional (pode adicionar várias fotos e enviar depois)

**Dados:**
```typescript
{
  fotos: [
    {
      file: File,
      descricao: string,
      animalIds: string[] // IDs dos animais na foto
    }
  ],
  enviarEmail: boolean
}
```

**Fluxo:**
1. Admin vai em "Upload de Fotos"
2. Seleciona múltiplas imagens
3. Para cada foto:
   - Adiciona descrição
   - Seleciona animais que aparecem
4. Marca checkbox "Enviar email aos usuários"
5. Clica "Salvar"
6. Se `enviarEmail: true`, sistema dispara email para todos usuários

**Email de Notificação:**
```
Assunto: 🐾 Novas fotos dos nossos pets!

Olá [NOME],

Acabamos de adicionar novas fotos de:
- Tigrão (3 fotos)
- Berenice (2 fotos)

Acesse sua galeria para ver: [LINK]
```

---

## 🎁 Sistema de Brindes

### Modelos de Dados

```typescript
interface Brinde {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'Adesivo' | 'Chaveiro' | 'Caneca' | 'Outro';
  foto: string;
  visivel: boolean; // Está disponível para resgate
  ordem: number; // 1 a 4 (máximo 4 visíveis)
  ativo: boolean;
}

interface ConfiguracaoRetirada {
  diasSemana: number[]; // [1,2,3,4,5] = Seg a Sex
  horarios: [
    { inicio: "09:00", fim: "12:00" },
    { inicio: "14:00", fim: "18:00" }
  ];
  ativo: boolean;
}

interface BrindeResgate {
  usuarioId: string;
  brindeId: string;
  dataRetirada: Date;
  horarioRetirada: string;
  status: 'Pendente' | 'Confirmado' | 'Retirado';
}
```

### Funcionalidades

#### 1. Cadastrar Brinde (Admin)

**Endpoint:** `POST /api/brindes`

**Dados:**
```typescript
{
  nome: string;
  descricao: string;
  tipo: 'Adesivo' | 'Chaveiro' | 'Caneca' | 'Outro';
  fotoFile: File;
}
```

#### 2. Selecionar Brindes Visíveis (Admin)

**Componente:** `GerenciarBrindesComponent`

**Endpoint:** `PUT /api/brindes/batch/disponibilidade`

**Fluxo:**
1. Admin vê todos os brindes cadastrados
2. Seleciona até 4 brindes para ficarem visíveis
3. Define ordem de exibição (1, 2, 3, 4)
4. Clica "Salvar seleção"
5. **Modal de confirmação:**
   ```
   Deseja trocar os brindes visíveis?
   
   Ao confirmar:
   - 4 novos brindes serão exibidos na home
   - Será enviado email a todos os apoiadores
   
   [Cancelar] [Confirmar]
   ```
6. Se confirmado:
   - Atualiza `visivel: true` nos 4 selecionados
   - Marca `visivel: false` nos demais
   - Dispara email para **todos apoiadores**

**Email de Troca:**
```
Assunto: 🎁 Novos brindes disponíveis!

Olá [NOME],

Temos novos brindes exclusivos para você resgatar:

[FOTO 1] Chaveiro Patas Solidárias
[FOTO 2] Caneca "Eu amo pets"
[FOTO 3] Adesivo Tigrão
[FOTO 4] Camiseta UTFPR Pets

Resgate o seu: [LINK]
```

#### 3. Configurar Horários de Retirada (Admin)

**Componente:** `ResgatesComponent` > aba "Configurações"

**Interface:**
```
Dias disponíveis:
☑ Segunda
☑ Terça
☑ Quarta
☑ Quinta
☑ Sexta
☐ Sábado
☐ Domingo

Horários:
09:00 às 12:00 [Remover]
14:00 às 18:00 [Remover]
[+ Adicionar horário]
```

#### 4. Resgatar Brinde (Usuário)

**Fluxo:**
1. Usuário vê 4 brindes disponíveis na home
2. Clica em "Resgatar"
3. Seleciona qual brinde quer
4. Escolhe data de retirada (calendário com apenas dias válidos)
5. Escolhe horário (apenas horários configurados)
6. Confirma
7. **Email enviado aos admins:**
   ```
   Novo resgate de brinde!
   
   Usuário: João Silva
   Email: joao@email.com
   Brinde: Chaveiro Patas
   Data/Hora: 25/10/2025 às 10:00
   
   [Ver detalhes no painel]
   ```

---

## 📰 Sistema de Posts/Newsletter

### Modelos de Dados

```typescript
interface Post {
  id: string;
  titulo: string;
  conteudoHtml: string; // Editor rico
  imagensAnexadas: [
    {
      tipo: 'animal' | 'brinde' | 'upload';
      id?: string; // ID do animal/brinde
      url: string;
      descricao?: string;
    }
  ];
  destinatarios: 'todos' | 'apoiadores';
  rascunho: boolean;
  dataEnvio?: Date;
  totalEnviados?: number;
}
```

### Funcionalidades

#### 1. Criar Post (Admin)

**Componente:** `EditorPostComponent`

**Features:**
- **Editor rico (Quill/TinyMCE/CKEditor)**
  - Formatação de texto (negrito, itálico, etc)
  - Listas
  - Links
  - Cores
- **Inserir imagens:**
  - Escolher foto de animal (lista todos animais com preview)
  - Escolher foto de brinde (lista todos brindes)
  - Upload direto de imagem
- **Template modificável:**
  - Cores primária/secundária
  - Logo customizável
  - Rodapé personalizado

**Interface:**
```
┌─────────────────────────────────────┐
│ Título: [________________]          │
│                                     │
│ [B] [I] [U] 🖼️  🐾  🎁  🔗         │
│ ┌─────────────────────────────┐    │
│ │ Olá {{NOME_USUARIO}},       │    │
│ │                             │    │
│ │ Temos novidades...          │    │
│ │                             │    │
│ │ [IMAGEM: Tigrão]            │    │
│ └─────────────────────────────┘    │
│                                     │
│ Destinatários:                      │
│ ○ Todos cadastrados                 │
│ ● Apenas apoiadores                 │
│                                     │
│ [Salvar Rascunho] [Enviar Agora]   │
└─────────────────────────────────────┘
```

**Inserir Foto de Animal:**
```
┌─────────────────────────────────────┐
│ Selecione um animal                 │
│                                     │
│ ┌───┐ Tigrão                        │
│ │🐱│ Gato listrado carinhoso        │
│ └───┘ [Inserir]                     │
│                                     │
│ ┌───┐ Berenice                      │
│ │🐶│ Cachorra alegre                │
│ └───┘ [Inserir]                     │
└─────────────────────────────────────┘
```

#### 2. Disparar Post (Admin)

**Endpoint:** `POST /api/posts/:id/enviar`

**Confirmação:**
```
Enviar newsletter?

Título: "Novidades de Outubro"
Destinatários: Apenas apoiadores (127 pessoas)

Esta ação não pode ser desfeita.

[Cancelar] [Enviar]
```

**Processamento:**
1. Backend processa fila de emails
2. Substitui variáveis: `{{NOME_USUARIO}}`, `{{DATA}}`, etc
3. Aplica template HTML
4. Envia para destinatários
5. Registra estatísticas (enviados, abertos)

---

## 📊 Dashboard de Assinaturas

### Componente: `AssinantesComponent`

### Estatísticas Principais

```
┌─────────────────────────────────────────────────┐
│ 📊 PAINEL DE ASSINANTES                         │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│ │   127    │  │   15     │  │ R$ 1.905 │      │
│ │ Ativos   │  │ Este mês │  │  Receita │      │
│ └──────────┘  └──────────┘  └──────────┘      │
│                                                 │
│ ▂▃▅▇█▇▅▃▂  Novos assinantes por mês            │
│                                                 │
│ ┌─────────────────────────────────────┐        │
│ │ MÊS        NOVOS  CANC.  RECEITA   │        │
│ ├─────────────────────────────────────┤        │
│ │ Out/2025    15     2     R$ 1.905  │        │
│ │ Set/2025    12     3     R$ 1.800  │        │
│ │ Ago/2025     8     1     R$ 1.680  │        │
│ └─────────────────────────────────────┘        │
│                                                 │
│ 🔍 [Buscar assinante...]                       │
│                                                 │
│ ┌─────────────────────────────────────┐        │
│ │ 👤 João Silva                      │        │
│ │ ✉️  joao@email.com                  │        │
│ │ 📅 Desde: 15/03/2023                │        │
│ │ 💰 R$ 15,00/mês                     │        │
│ │ ✅ Ativa                             │        │
│ │ [Ver detalhes]                      │        │
│ └─────────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
```

### API Endpoints

**GET `/api/admin/stats/assinaturas`**
```json
{
  "totalAssinantes": 127,
  "assinantesAtivos": 120,
  "assinantesCancelados": 7,
  "receitaMensal": 1905.00,
  "porMes": [
    {
      "mes": "2025-10",
      "novos": 15,
      "cancelamentos": 2,
      "receita": 1905.00
    }
  ],
  "porDiaSemana": [
    { "dia": "Segunda", "quantidade": 23 },
    { "dia": "Terça", "quantidade": 18 }
  ]
}
```

**GET `/api/admin/assinantes/:id`**
```json
{
  "usuario": {
    "nome": "João Silva",
    "email": "joao@email.com"
  },
  "plano": "Mensal R$ 15",
  "status": "ativa",
  "dataInicio": "2023-03-15",
  "totalPago": 405.00,
  "mesesAtivo": 27,
  "historicoPagamentos": [
    {
      "data": "2025-10-01",
      "valor": 15.00,
      "status": "Aprovado"
    }
  ]
}
```

---

## 👥 Sistema de Convite de Admins

### Fluxo Completo

#### 1. Admin Convida Novo Admin

**Componente:** `AdminsComponent` > "Convidar Admin"

**Validação:**
```typescript
// Backend verifica se email está cadastrado
const usuario = await User.findOne({ email });

if (!usuario) {
  throw new Error('Usuário não encontrado. A pessoa deve estar cadastrada no sistema.');
}

if (usuario.isAdmin) {
  throw new Error('Este usuário já é administrador.');
}
```

**Form:**
```
┌─────────────────────────────────────┐
│ Convidar novo administrador         │
│                                     │
│ Email: [_________________]          │
│                                     │
│ Permissões:                         │
│ ☑ Gerenciar animais                 │
│ ☑ Gerenciar fotos                   │
│ ☑ Gerenciar brindes                 │
│ ☑ Gerenciar posts                   │
│ ☑ Visualizar assinantes             │
│ ☐ Convidar outros admins            │
│ ☐ Gerenciar configurações           │
│                                     │
│ [Cancelar] [Enviar Convite]         │
└─────────────────────────────────────┘
```

#### 2. Email de Convite

**Enviado para:** `usuario@email.com`

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .card { 
      max-width: 600px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🛡️ Convite para Admin</h1>
    
    <p>Olá,</p>
    
    <p><strong>João Silva</strong> convidou você para ser administrador do sistema Patas Solidárias.</p>
    
    <p>Permissões concedidas:</p>
    <ul>
      <li>✅ Gerenciar animais</li>
      <li>✅ Gerenciar fotos</li>
      <li>✅ Gerenciar brindes</li>
    </ul>
    
    <a href="https://patassolidarias.com/admin/convite/aceitar?token=abc123xyz" 
       style="background: white; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
      Aceitar Convite
    </a>
    
    <p style="color: #ddd; font-size: 12px; margin-top: 30px;">
      Este convite expira em 7 dias.
    </p>
  </div>
</body>
</html>
```

#### 3. Usuário Aceita Convite

**Rota:** `/admin/convite/aceitar?token=abc123xyz`

**Fluxo:**
1. Sistema valida token
2. Verifica se não expirou (7 dias)
3. Usuário já deve estar logado (redirect para login se não)
4. Confirma aceitação
5. Atualiza `user.role = 'admin'`
6. Atribui permissões
7. Redireciona para `/admin`

**Tela de Confirmação:**
```
┌─────────────────────────────────────┐
│ Aceitar convite administrativo      │
│                                     │
│ Você foi convidado por:             │
│ 👤 João Silva (joao@admin.com)      │
│                                     │
│ Permissões que você receberá:       │
│ ✅ Gerenciar animais                 │
│ ✅ Gerenciar fotos                   │
│ ✅ Gerenciar brindes                 │
│                                     │
│ Ao aceitar, você terá acesso ao     │
│ painel administrativo.              │
│                                     │
│ [Recusar] [Aceitar]                 │
└─────────────────────────────────────┘
```

---

## 🏠 Integração com Home

### Seção "Conheça nossas patinhas"

**Antes (estático):**
```typescript
const animaisEstaticos = [
  { nome: 'Tigrão', foto: 'assets/tigrao.jpg' }
];
```

**Depois (dinâmico):**
```typescript
// home.component.ts
ngOnInit() {
  this.animalService.getActiveAnimals().subscribe(animais => {
    this.animais = animais.map(a => ({
      nome: a.nome,
      foto: a.fotoPerfil,
      descricao: a.descricao
    }));
  });
}
```

**Template:**
```html
<!-- home.component.html -->
<section id="conheca-patinhas">
  <h2>🐾 Conheça nossas patinhas</h2>
  
  <div class="grid-animais">
    @for (animal of animais; track animal.id) {
      <div class="card-animal">
        <img [src]="animal.fotoPerfil" [alt]="animal.nome">
        <h3>{{ animal.nome }}</h3>
        <p>{{ animal.descricao }}</p>
      </div>
    }
  </div>
</section>
```

### Seção "Brindes Exclusivos"

**Lógica dinâmica:**
```typescript
// home.component.ts
ngOnInit() {
  this.brindeService.listarBrindes({ 
    disponiveis: true, 
    limit: 4 
  }).subscribe(({ brindes }) => {
    this.brindes = brindes;
    
    // Verificar tipo predominante
    const temApenasAdesivos = brindes.every(b => 
      b.tipo === 'Adesivo'
    );
    
    this.tituloBrindes = temApenasAdesivos 
      ? 'Confira os adesivos exclusivos dos nossos pets'
      : 'Conheça os brindes exclusivos dos nossos pets';
  });
}
```

**Template:**
```html
<!-- home.component.html -->
<section id="brindes">
  <h2>{{ tituloBrindes }}</h2>
  
  <div class="grid-brindes">
    @for (brinde of brindes; track brinde.id) {
      <div class="card-brinde">
        <img [src]="brinde.foto" [alt]="brinde.nome">
        <h3>{{ brinde.nome }}</h3>
        <p>{{ brinde.descricao }}</p>
        
        @if (isDoador) {
          <button (click)="resgatar(brinde)">
            Resgatar
          </button>
        }
      </div>
    }
  </div>
</section>
```

---

## 🔌 Endpoints Backend (Resumo)

### Animais
```
GET    /api/animals              # Listar todos
GET    /api/animals/active       # Listar ativos
GET    /api/animals/:id          # Buscar por ID
POST   /api/animals              # Criar (FormData com foto)
PUT    /api/animals/:id          # Atualizar
DELETE /api/animals/:id          # Deletar
PATCH  /api/animals/:id/status   # Ativar/desativar
PUT    /api/animals/:id/foto-perfil  # Trocar foto perfil
```

### Fotos
```
GET    /api/fotos                    # Listar fotos
GET    /api/fotos/:id                # Buscar por ID
POST   /api/fotos/batch              # Upload múltiplo + email
PUT    /api/fotos/:id                # Atualizar descrição/animais
DELETE /api/fotos/:id                # Deletar
```

### Brindes
```
GET    /api/brindes                        # Listar todos
GET    /api/brindes/:id                    # Buscar por ID
POST   /api/brindes                        # Criar (FormData)
PUT    /api/brindes/:id                    # Atualizar
DELETE /api/brindes/:id                    # Deletar
PUT    /api/brindes/batch/disponibilidade  # Atualizar visíveis + email
```

### Resgates
```
GET    /api/resgates/configuracao           # Buscar config horários
PUT    /api/resgates/configuracao           # Atualizar config
GET    /api/resgates/solicitacoes           # Listar solicitações
POST   /api/resgates/solicitacoes           # Criar solicitação
PUT    /api/resgates/solicitacoes/:id       # Atualizar status
DELETE /api/resgates/solicitacoes/:id       # Cancelar
```

### Posts
```
GET    /api/posts            # Listar posts
GET    /api/posts/:id        # Buscar por ID
POST   /api/posts            # Criar post
PUT    /api/posts/:id        # Atualizar
DELETE /api/posts/:id        # Deletar
POST   /api/posts/:id/enviar # Disparar newsletter
```

### Admin
```
GET    /api/admin/check              # Verificar se é admin
GET    /api/admin/stats/assinaturas  # Estatísticas
GET    /api/admin/assinantes         # Listar assinantes
GET    /api/admin/assinantes/:id     # Detalhe assinante
GET    /api/admin/convites           # Listar convites
POST   /api/admin/convites           # Criar convite
GET    /api/admin/convites/verificar/:token  # Verificar token
POST   /api/admin/convites/aceitar/:token    # Aceitar convite
DELETE /api/admin/convites/:id       # Cancelar convite
```

---

## 📧 Sistema de Emails

### Templates Disponíveis

#### 1. Notificação de Novas Fotos
```
Disparado quando: Admin adiciona fotos com "enviar email"
Destinatários: Todos usuários cadastrados
Variáveis: {{NOME_USUARIO}}, {{ANIMAIS_LISTA}}, {{TOTAL_FOTOS}}
```

#### 2. Troca de Brindes
```
Disparado quando: Admin muda seleção de brindes visíveis
Destinatários: Apenas apoiadores (isDoador = true)
Variáveis: {{NOME_USUARIO}}, {{BRINDES_GRID}}
```

#### 3. Solicitação de Resgate
```
Disparado quando: Usuário solicita resgate de brinde
Destinatários: Todos admins
Variáveis: {{USUARIO_NOME}}, {{USUARIO_EMAIL}}, {{BRINDE_NOME}}, {{DATA_HORA}}
```

#### 4. Convite Admin
```
Disparado quando: Admin convida novo admin
Destinatários: Usuário específico (email fornecido)
Variáveis: {{CONVIDADO_NOME}}, {{ADMIN_NOME}}, {{TOKEN}}, {{PERMISSOES_LISTA}}
```

#### 5. Newsletter (Post)
```
Disparado quando: Admin dispara post
Destinatários: Todos ou apenas apoiadores (conforme seleção)
Variáveis: Template customizável pelo admin
```

---

## 🎨 Guia de Estilo

### Cores do Sistema

**Admin (Roxo):**
```scss
$admin-primary: #667eea;
$admin-secondary: #764ba2;
$admin-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Cliente (Verde):**
```scss
$user-primary: #10b981;
$user-secondary: #059669;
```

**Estados:**
```scss
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;
```

### Ícones Padrão

- **Animais:** 🐾 `fas fa-paw`
- **Fotos:** 📸 `fas fa-images`
- **Brindes:** 🎁 `fas fa-gift`
- **Posts:** 📰 `fas fa-newspaper`
- **Admin:** 🛡️ `fas fa-shield-alt`
- **Assinantes:** 👥 `fas fa-users`
- **Resgates:** 📦 `fas fa-box`
- **Email:** 📧 `fas fa-envelope`
- **Config:** ⚙️ `fas fa-cog`

---

## 🚀 Próximos Passos de Implementação

### Backend (Priority)
1. ✅ Implementar todos endpoints REST
2. ✅ Sistema de upload de arquivos (multer/cloudinary)
3. ✅ Sistema de filas (Bull/BullMQ) para emails
4. ✅ Templates de email (Handlebars/EJS)
5. ✅ Middleware de autenticação JWT
6. ✅ Middleware de verificação admin

### Frontend (Priority)
1. ✅ Todos serviços já criados
2. ⏳ Atualizar componentes admin com novas features
3. ⏳ Integrar home com APIs
4. ⏳ Testes de integração
5. ⏳ Deploy staging

### Melhorias Futuras
- Dashboard com gráficos (Chart.js/ApexCharts)
- Notificações em tempo real (WebSocket)
- Sistema de log de ações admin
- Backup automático de dados
- Relatórios em PDF

---

## 📝 Checklist de Funcionalidades

### Sistema de Animais
- [x] CRUD básico
- [x] Upload de foto perfil
- [x] Associar múltiplas fotos
- [x] Trocar foto perfil entre existentes
- [x] Listagem na home

### Sistema de Fotos
- [x] Upload múltiplo
- [x] Associar a múltiplos animais
- [x] Descrições
- [x] Notificação por email em lote
- [ ] Galeria pública

### Sistema de Brindes
- [x] CRUD básico
- [x] Selecionar até 4 visíveis
- [x] Ordem de exibição
- [x] Notificação de troca
- [x] Exibição dinâmica na home

### Sistema de Resgates
- [x] Configurar dias/horários
- [x] Solicitação de resgate
- [x] Email para admins
- [ ] Status tracking
- [ ] Histórico de resgates

### Sistema de Posts
- [ ] Editor rico
- [ ] Inserir imagens de animais/brindes
- [ ] Template customizável
- [ ] Envio para todos/apoiadores
- [ ] Estatísticas de abertura

### Dashboard Admin
- [ ] Estatísticas gerais
- [ ] Gráficos de crescimento
- [ ] Lista de assinantes
- [ ] Detalhe de assinante
- [ ] Filtros e busca

### Sistema de Convites
- [x] Enviar convite
- [x] Validar usuário existe
- [x] Email de convite
- [x] Aceitar via link
- [x] Gerenciar permissões
- [ ] Revogar acesso admin

---

## 🛡️ Segurança

### Validações Importantes

1. **Convite Admin:**
   - ✅ Usuário DEVE estar cadastrado
   - ✅ Não pode ser admin já
   - ✅ Token com expiração 7 dias
   - ✅ Apenas admins podem convidar

2. **Upload de Arquivos:**
   - ✅ Validar tipo (imagens apenas)
   - ✅ Limite de tamanho (5MB)
   - ✅ Sanitizar nome do arquivo
   - ✅ Scan antivírus (opcional)

3. **Emails:**
   - ✅ Rate limiting (max 100/hora)
   - ✅ Validar destinatários
   - ✅ Sanitizar HTML
   - ✅ Unsubscribe link

---

## 📖 Glossário

- **Apoiador:** Usuário com `isDoador = true` (fez doação/assinatura)
- **Admin:** Usuário com `role = 'admin'`
- **Visível:** Brinde disponível para resgate (`visivel = true`)
- **Disparar Email:** Enviar notificação para múltiplos usuários
- **Batch:** Operação em lote (múltiplos itens)
- **Newsletter:** Email marketing enviado via sistema de posts

---

Documentação criada em: Outubro 2025
Versão: 1.0
Projeto: Patas Solidárias - UTFPR Medianeira
