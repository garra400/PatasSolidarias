# 🐾 Patas Solidárias - UTFPR Medianeira

<div align="center">

![Patas Solidárias](https://img.shields.io/badge/Patas-Solidárias-10b981?style=for-the-badge&logo=paw&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-20.3.6-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Plataforma completa de gerenciamento para projeto de cuidado aos animais**

[Instalação](#-instalação) • [Documentação](#-documentação-adicional) • [Contribuir](#-como-contribuir)

</div>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades-principais)
- [Tecnologias](#️-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Rotas da Aplicação](#️-rotas-da-aplicação)
- [Desenvolvimento](#-desenvolvimento)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação Adicional](#-documentação-adicional)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 🎯 Sobre o Projeto

**Patas Solidárias** é uma plataforma web desenvolvida para auxiliar no gerenciamento completo de campanhas de cuidado e apoio aos animais da UTFPR Medianeira. O sistema oferece três áreas distintas e integradas:

### 🌐 **Área Pública**
Landing page informativa com galeria de animais, informações sobre a campanha e sistema de login/registro.

### 👤 **Área do Usuário**
Portal personalizado onde apoiadores podem:
- Fazer doações únicas ou recorrentes
- Acessar galeria exclusiva de fotos dos pets
- Resgatar brindes disponíveis
- Gerenciar suas assinaturas e histórico de pagamentos

### 🛡️ **Painel Administrativo**
Sistema completo de gestão com:
- Dashboard com estatísticas em tempo real
- CRUD de animais, fotos e brindes
- Sistema de notificações por email
- Gerenciamento de resgates e agendamentos
- Editor de newsletter

---

## ✨ Funcionalidades Principais

### 🎨 Interface e UX

- ✅ **Design Responsivo** - Totalmente adaptado para mobile, tablet e desktop
- ✅ **Tema Dual** - Paleta verde para usuários e roxa para administradores
- ✅ **Navegação Intuitiva** - Sidebars expansíveis e breadcrumbs
- ✅ **Animações Suaves** - Transições e efeitos visuais modernos

### 👥 Sistema de Usuários

- ✅ **Autenticação Dual** - Login separado para usuários (`/login`) e admins (`/admin/login`)
- ✅ **JWT Authentication** - Tokens seguros com refresh automático
- ✅ **Guards de Rota** - Proteção de páginas por nível de acesso
- ✅ **Perfis Personalizáveis** - Upload de foto de perfil e edição de dados
- ✅ **Recuperação de Senha** - Sistema de reset via email

### 🐾 Gestão de Animais

- ✅ **CRUD Completo** - Criar, visualizar, editar e desativar animais
- ✅ **Upload de Fotos** - Suporte a múltiplas imagens por animal
- ✅ **Galeria Inteligente** - Auto-associação de fotos ao criar/editar
- ✅ **Troca de Foto de Perfil** - Modal para selecionar entre fotos existentes
- ✅ **Filtros Avançados** - Por nome, tipo (cão/gato), status (ativo/inativo)

### 📸 Sistema de Fotos

- ✅ **Upload Múltiplo** - Envio de várias fotos simultâneas
- ✅ **Associação Múltipla** - Vincular uma foto a vários animais
- ✅ **Descrições** - Texto descritivo para cada imagem
- ✅ **Notificações em Lote** - Email automático para apoiadores quando novas fotos são adicionadas
- ✅ **Galeria Exclusiva** - Visualização apenas para usuários autenticados
- ✅ **Thumbnails Clicáveis** - Filtro visual por animal

### 🎁 Sistema de Brindes

- ✅ **CRUD de Brindes** - Gerenciamento completo de itens
- ✅ **Seleção Destacada** - Admin escolhe até 4 brindes para exibir na home
- ✅ **Sistema de Ordem** - Definir ordem de exibição
- ✅ **Confirmação de Troca** - Modal com resumo antes de publicar
- ✅ **Notificação Automática** - Email em lote ao alterar brindes visíveis
- ✅ **Resgate por Usuários** - Solicitação de retirada com agendamento

### 📊 Dashboard e Analytics

- ✅ **Estatísticas em Tempo Real** - KPIs de doações, assinantes e resgates
- ✅ **Filtros Dinâmicos** - Por período (semana/mês/ano) e tipo de plano
- ✅ **Gráficos Interativos** - Visualização de dados com Chart.js
- ✅ **Cards de Resumo** - Total de animais, fotos, apoiadores ativos

### 📧 Sistema de Emails

- ✅ **Templates Personalizados** - Design responsivo para diferentes tipos de email
- ✅ **Disparos em Lote** - Envio para todos ou apenas apoiadores
- ✅ **Fila de Processamento** - Sistema Bull para envios assíncronos
- ✅ **Confirmações Automáticas** - Email de boas-vindas, confirmação de doação, etc.

### 🔐 Segurança

- ✅ **Autenticação JWT** - Tokens com expiração e refresh
- ✅ **Variáveis de Ambiente** - Dados sensíveis protegidos em `.env`
- ✅ **Validação de Formulários** - Client-side e server-side
- ✅ **Proteção CSRF** - Tokens anti-falsificação
- ✅ **Rate Limiting** - Prevenção de ataques de força bruta

---

## 🛠️ Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Angular** | 20.3.6 | Framework principal com Standalone Components |
| **TypeScript** | 5.7 | Superset do JavaScript com tipagem estática |
| **SCSS** | - | Pré-processador CSS com variáveis e mixins |
| **RxJS** | 7.8+ | Programação reativa e gerenciamento de estado |
| **Angular Router** | 20.3.6 | Navegação com lazy loading |
| **Chart.js** | 4.x | Gráficos interativos |

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript server-side |
| **Express** | 4.x | Framework web minimalista |
| **MongoDB** | 6+ | Banco de dados NoSQL |
| **Mongoose** | 8.x | ODM para MongoDB |
| **JWT** | 9.x | Autenticação baseada em tokens |
| **Multer** | 1.4.x | Upload de arquivos |
| **Nodemailer** | 6.x | Envio de emails |
| **Bull** | 4.x | Filas de processamento |

### DevOps e Ferramentas

- **Git** - Controle de versão
- **GitHub** - Repositório remoto
- **VSCode** - IDE principal
- **Postman** - Testes de API
- **MongoDB Compass** - Interface para banco de dados

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

```bash
# Node.js (versão 18 ou superior)
node --version  # v18.x.x ou maior

# npm (vem com Node.js)
npm --version   # 9.x.x ou maior

# Angular CLI (global)
npm install -g @angular/cli
ng version      # 20.3.6 ou maior

# Git
git --version   # 2.x.x ou maior
```

---

## 📦 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/garra400/PatasSolidarias.git
cd PatasSolidarias
```

### 2. Instale as Dependências

```bash
# Frontend (raiz do projeto)
npm install

# Backend (separado)
cd backend
npm install
cd ..
```

### 3. Configure as Variáveis de Ambiente

#### Frontend: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  mercadoPagoPublicKey: 'SUA_PUBLIC_KEY_AQUI'
};
```

#### Backend: `backend/.env`

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/patassolidarias

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRE=7d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# Mercado Pago
MP_ACCESS_TOKEN=seu_access_token_aqui
MP_PUBLIC_KEY=sua_public_key_aqui

# URLs
FRONTEND_URL=http://localhost:4200
```

### 4. Inicie os Servidores

#### Terminal 1 - Backend

```bash
cd backend
npm start
# ou para desenvolvimento com nodemon:
npm run dev
```

#### Terminal 2 - Frontend

```bash
ng serve
# ou
npm start
```

### 5. Acesse a Aplicação

- **Frontend:** [http://localhost:4200](http://localhost:4200)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)

---

## ⚙️ Configuração

### Configuração do MongoDB Atlas

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um novo cluster (Free Tier disponível)
3. Configure um usuário de banco de dados
4. Whitelist seu IP (ou use `0.0.0.0/0` para desenvolvimento)
5. Copie a connection string para `backend/.env`

### Configuração do Mercado Pago

1. Crie uma conta em [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Acesse "Suas integrações" → "Credenciais de teste"
3. Copie `Public Key` e `Access Token`
4. Cole em `backend/.env` e `environment.ts`

### Configuração de Email (Nodemailer)

Para Gmail:
1. Ative a verificação em 2 etapas
2. Gere uma "Senha de App"
3. Use essa senha em `SMTP_PASS`

---

## 📁 Estrutura do Projeto

```
src/app/
├── components/
│   ├── admin/                    # Componentes administrativos
│   │   ├── auth/
│   │   │   └── admin-login/      # Login admin (/admin/login)
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── animais/              # CRUD de animais
│   │   ├── fotos/                # Gestão de fotos
│   │   ├── brindes/              # CRUD de brindes
│   │   ├── gerenciar-brindes/    # Seleção de visíveis
│   │   ├── posts/                # Newsletter
│   │   ├── assinantes/           # Estatísticas
│   │   ├── resgates/             # Gerenciar resgates
│   │   └── admins/               # Convites e permissões
│   ├── user/                     # Área do usuário
│   │   ├── user-layout/          # Layout com sidebar
│   │   ├── seja-apoiador/        # Página de doação
│   │   ├── fotos/                # Galeria exclusiva
│   │   ├── meus-brindes/         # Brindes do usuário
│   │   └── ...
│   ├── auth/                     # Login/Registro público
│   ├── shared/                   # Componentes compartilhados
│   │   ├── header/               # Header global
│   │   └── ...
│   └── home/                     # Landing page
├── service/
│   ├── auth.service.ts           # Autenticação
│   ├── animal.service.ts         # CRUD animais
│   ├── foto.service.ts           # Upload e gestão fotos
│   ├── brinde.service.ts         # CRUD brindes
│   ├── post.service.ts           # Newsletter
│   ├── resgate.service.ts        # Agendamentos
│   ├── admin.service.ts          # Convites e permissões
│   └── ...
├── model/
│   ├── user.model.ts             # Usuário
│   ├── animal.model.ts           # Animal + Foto
│   ├── brinde.model.ts           # Brinde + Config + Resgate
│   ├── post.model.ts             # Post + Template
│   └── admin.model.ts            # Convite + Stats
├── guards/
│   ├── auth.guard.ts             # Protege rotas autenticadas
│   └── admin.guard.ts            # Protege rotas admin
└── routes/
    ├── app.routes.ts             # Rotas principais
    └── admin.routes.ts           # Rotas administrativas
```

---

## 🗺️ Rotas

---

## 🗺️ Rotas da Aplicação

### 🌐 Rotas Públicas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `HomeComponent` | Landing page principal |
| `/login` | `LoginComponent` | Login de usuários regulares |
| `/registro` | `RegistroComponent` | Cadastro de novos usuários |
| `/recuperar-senha` | `RecuperarSenhaComponent` | Recuperação de senha |
| `/confirmar-email/:token` | `ConfirmarEmailComponent` | Confirmação de email |

### 👤 Rotas do Usuário (requer autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/conta` | `DashboardComponent` | Dashboard do usuário |
| `/conta/seja-apoiador` | `SejaApoiadorComponent` | Página de doação |
| `/conta/doar-novamente` | `DoarNovamenteComponent` | Renovar doação |
| `/conta/fotos` | `FotosComponent` | Galeria exclusiva |
| `/conta/meus-brindes` | `MeusBrindesComponent` | Brindes resgatados |
| `/conta/pagamentos` | `PagamentosComponent` | Histórico de pagamentos |
| `/conta/assinatura` | `AssinaturaComponent` | Gerenciar assinatura |
| `/conta/configuracoes` | `ConfiguracoesComponent` | Editar perfil |

### 🛡️ Rotas Administrativas (requer admin)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/admin/login` | `AdminLoginComponent` | Login administrativo (público) |
| `/admin` | `DashboardComponent` | Dashboard admin |
| `/admin/animais` | `ListaAnimaisComponent` | Listar animais |
| `/admin/animais/novo` | `FormAnimalComponent` | Criar animal |
| `/admin/animais/:id` | `FormAnimalComponent` | Editar animal |
| `/admin/fotos` | `ListaFotosComponent` | Gerenciar fotos |
| `/admin/fotos/upload` | `UploadFotosComponent` | Upload múltiplo |
| `/admin/brindes` | `ListaBrindesComponent` | Listar brindes |
| `/admin/brindes/novo` | `FormBrindeComponent` | Criar brinde |
| `/admin/brindes/:id` | `FormBrindeComponent` | Editar brinde |
| `/admin/gerenciar-brindes` | `SelecionarBrindesComponent` | Escolher visíveis |

---

## 💻 Desenvolvimento

### Executar em Modo de Desenvolvimento

```bash
# Frontend (porta 4200)
ng serve

# Backend (porta 3000)
cd backend
npm run dev
```

### Build de Produção

```bash
# Frontend
ng build --configuration production

# Backend
cd backend
npm run build
```

Os artefatos de build ficarão em `dist/`.

### Testes

```bash
# Testes unitários (Frontend)
ng test

# Testes e2e (Frontend)
ng e2e

# Testes (Backend)
cd backend
npm test
```

### Linting e Formatação

```bash
# Verificar código
ng lint

# Formatar código
npm run format
```

---

## 📜 Scripts Disponíveis

### Frontend (`package.json` raiz)

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "lint": "ng lint",
    "format": "prettier --write \"src/**/*.{ts,html,scss}\""
  }
}
```

### Backend (`backend/package.json`)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "seed": "node utils/seed.js"
  }
}
```

---

## 📚 Documentação Adicional

Toda a documentação técnica detalhada está disponível na pasta **`/docs`**:

| Arquivo | Descrição |
|---------|-----------|
| **[GUIA_DESENVOLVIMENTO.md](./docs/GUIA_DESENVOLVIMENTO.md)** | Guia completo para desenvolvedores com workflows, padrões de código e boas práticas |
| **[LISTA_DE_TESTES.md](./docs/LISTA_DE_TESTES.md)** | Checklist com 35+ casos de teste funcionais para validação do sistema |
| **[MERCADOPAGO-IMPLEMENTATION.md](./docs/MERCADOPAGO-IMPLEMENTATION.md)** | Documentação detalhada da integração com Mercado Pago |
| **[RESUMO_FINAL.md](./docs/RESUMO_FINAL.md)** | Resumo completo das implementações realizadas no projeto |
| **[ROADMAP_FEATURES.md](./docs/ROADMAP_FEATURES.md)** | Roadmap com funcionalidades concluídas e planejadas |
| **[GALERIA_FOTOS.md](./backend/docs/GALERIA_FOTOS.md)** | Sistema de galeria baseado em meses de apoio |

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Siga os passos abaixo:

### 1. Fork o Projeto

```bash
# Clique em "Fork" no GitHub
```

### 2. Clone seu Fork

```bash
git clone https://github.com/SEU_USUARIO/PatasSolidarias.git
cd PatasSolidarias
```

### 3. Crie uma Branch

```bash
git checkout -b feature/minha-nova-funcionalidade
# ou
git checkout -b fix/correcao-de-bug
```

### 4. Faça suas Alterações

```bash
# Edite os arquivos
# Teste suas mudanças
npm test
ng lint
```

### 5. Commit suas Mudanças

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

**Padrão de Commits (Conventional Commits):**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alteração em documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Adição/alteração de testes
- `chore:` - Tarefas de build/config

### 6. Push para seu Fork

```bash
git push origin feature/minha-nova-funcionalidade
```

### 7. Abra um Pull Request

1. Vá para o repositório original no GitHub
2. Clique em "Pull Requests" → "New Pull Request"
3. Selecione seu fork e branch
4. Descreva suas alterações
5. Aguarde revisão

---

## 🎨 Guia de Estilo

### Cores do Tema

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
$user-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Convenções de Código

- ✅ **Standalone Components** - Todos componentes usam `standalone: true`
- ✅ **Control Flow Syntax** - Usar `@if`, `@for`, `@switch` (Angular 17+)
- ✅ **Path Aliases** - Importar com `@services/`, `@models/`, `@components/`
- ✅ **RxJS Best Practices** - Sempre fazer `unsubscribe` ou usar `async` pipe
- ✅ **TypeScript Strict Mode** - Tipagem forte em todo código
- ✅ **SCSS Modules** - Um arquivo `.scss` por componente

---

## 📊 Roadmap

### ✅ Fase 1 - Concluída (Q4 2024)
- [x] Estrutura base do projeto
- [x] Sistema de autenticação dual
- [x] Área do usuário completa
- [x] CRUD de animais, fotos e brindes
- [x] Sistema de foto de perfil
- [x] Filtros de dashboard
- [x] Guards e proteção de rotas
- [x] Organização de documentação
- [x] Sistema de galeria por mês de apoio

### ⏳ Fase 2 - Em Desenvolvimento (Q1 2025)
- [ ] Editor de posts com newsletter
- [ ] Sistema de gráficos avançados
- [ ] Dashboard de estatísticas completo
- [ ] Integração Mercado Pago
- [ ] Sistema de resgates com calendário
- [ ] Testes unitários (80%+ cobertura)

### 🔮 Fase 3 - Futuro (Q2 2025)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Sistema de chat admin-usuário
- [ ] PWA (Progressive Web App)
- [ ] App mobile (Ionic)
- [ ] Painel de analytics avançado
- [ ] Exportação de relatórios (PDF/Excel)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2024 UTFPR Medianeira - Patas Solidárias

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Equipe

### Desenvolvedor Principal
**João Victor "Garra" dos Santos Gomes**
- GitHub: [@garra400](https://github.com/garra400)
- Email: joaovictor.garra@example.com

### Instituição
**UTFPR Medianeira - Projeto Patas Solidárias**
- Website: [utfpr.edu.br](https://utfpr.edu.br)
- Campus: Medianeira - PR

---

## 📞 Contato e Suporte

### Para Dúvidas e Suporte

- **Email:** patassolidarias@utfpr.edu.br
- **Instagram:** [@patassolidarias_utfpr](https://instagram.com/patassolidarias_utfpr)
- **Issues:** [GitHub Issues](https://github.com/garra400/PatasSolidarias/issues)

### Para Contribuições

- **Pull Requests:** [GitHub PRs](https://github.com/garra400/PatasSolidarias/pulls)
- **Discussions:** [GitHub Discussions](https://github.com/garra400/PatasSolidarias/discussions)

---

## 🙏 Agradecimentos

Agradecimentos especiais a:

- **UTFPR Medianeira** - Pelo suporte institucional
- **Comunidade Angular** - Pela documentação e suporte
- **Comunidade Open Source** - Pelas bibliotecas utilizadas
- **Todos os Apoiadores** - Que tornam este projeto possível

---

## 📈 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/garra400/PatasSolidarias)
![GitHub issues](https://img.shields.io/github/issues/garra400/PatasSolidarias)
![GitHub pull requests](https://img.shields.io/github/issues-pr/garra400/PatasSolidarias)
![GitHub stars](https://img.shields.io/github/stars/garra400/PatasSolidarias?style=social)

---

<div align="center">

**Feito com ❤️ e 🐾 por estudantes da UTFPR-MD**

[⬆ Voltar ao topo](#-patas-solidárias---utfpr-medianeira)

</div>
