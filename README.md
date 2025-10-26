# 🐾 Patas Solidárias - UTFPR Medianeira# 🐾 Patas Solidárias - UTFPR Medianeira



<div align="center">Sistema completo de gerenciamento para o projeto de cuidado aos animais da UTFPR-MD, com área pública, área do usuário e painel administrativo completo.



![Patas Solidárias](https://img.shields.io/badge/Patas-Solidárias-10b981?style=for-the-badge&logo=paw&logoColor=white)![Angular](https://img.shields.io/badge/Angular-20.3.6-red)

![Angular](https://img.shields.io/badge/Angular-20.3.6-DD0031?style=for-the-badge&logo=angular&logoColor=white)![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)![License](https://img.shields.io/badge/license-MIT-green)

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)## 📋 Índice



**Plataforma completa de gerenciamento para projeto de cuidado aos animais**- [Sobre o Projeto](#sobre-o-projeto)

- [Funcionalidades](#funcionalidades)

[Instalação](#-instalação) • [Documentação](#-documentação-adicional) • [Contribuir](#-como-contribuir)- [Tecnologias](#tecnologias)

- [Instalação](#instalação)

</div>- [Estrutura do Projeto](#estrutura-do-projeto)

- [Rotas](#rotas)

---- [Documentação Completa](#documentação-completa)

- [Desenvolvimento](#desenvolvimento)

## 📋 Sumário

---

- [Sobre o Projeto](#-sobre-o-projeto)

- [Funcionalidades](#-funcionalidades-principais)## 🎯 Sobre o Projeto

- [Tecnologias](#️-tecnologias-utilizadas)

- [Pré-requisitos](#-pré-requisitos)Patas Solidárias é uma plataforma para gerenciar doações, assinaturas, galeria de fotos e brindes para os animais cuidados pela UTFPR Medianeira. O sistema possui:

- [Instalação](#-instalação)

- [Configuração](#️-configuração)- **Área Pública:** Landing page com informações sobre os animais e campanha

- [Estrutura do Projeto](#-estrutura-do-projeto)- **Área do Usuário:** Gerenciamento de doações, galeria exclusiva e resgate de brindes

- [Rotas da Aplicação](#️-rotas-da-aplicação)- **Painel Admin:** Sistema completo de gestão de conteúdo, usuários e estatísticas

- [Desenvolvimento](#-desenvolvimento)

- [Scripts Disponíveis](#-scripts-disponíveis)---

- [Documentação Adicional](#-documentação-adicional)

- [Como Contribuir](#-como-contribuir)## ✨ Funcionalidades

- [Licença](#-licença)

- [Contato](#-contato)### 🌐 Área Pública

- ✅ Landing page responsiva

---- ✅ Galeria de animais cadastrados

- ✅ Informações sobre a campanha

## 🎯 Sobre o Projeto- ✅ Sistema de login/registro



**Patas Solidárias** é uma plataforma web desenvolvida para auxiliar no gerenciamento completo de campanhas de cuidado e apoio aos animais da UTFPR Medianeira. O sistema oferece três áreas distintas e integradas:### 👤 Área do Usuário (`/conta`)

- ✅ Dashboard personalizado

### 🌐 **Área Pública**- ✅ Sistema de doações (PIX e assinatura recorrente)

Landing page informativa com galeria de animais, informações sobre a campanha e sistema de login/registro.- ✅ Galeria exclusiva de fotos dos pets

- ✅ Resgate de brindes

### 👤 **Área do Usuário**- ✅ Histórico de pagamentos

Portal personalizado onde apoiadores podem:- ✅ Gerenciamento de assinatura

- Fazer doações únicas ou recorrentes- ✅ Configurações de perfil

- Acessar galeria exclusiva de fotos dos pets

- Resgatar brindes disponíveis### 🛡️ Painel Administrativo (`/admin`)

- Gerenciar suas assinaturas e histórico de pagamentos- ✅ **Login Separado:** Autenticação dedicada em `/admin/login`

- ✅ **Dashboard:** Estatísticas gerais e KPIs

### 🛡️ **Painel Administrativo**- ✅ **Gestão de Animais:**

Sistema completo de gestão com:  - CRUD completo

- Dashboard com estatísticas em tempo real  - Upload de foto de perfil

- CRUD de animais, fotos e brindes  - Trocar foto de perfil entre fotos existentes

- Sistema de notificações por email  - Ativar/desativar animais

- Gerenciamento de resgates e agendamentos- ✅ **Gestão de Fotos:**

- Editor de newsletter  - Upload múltiplo

  - Associar fotos a múltiplos animais

---  - Adicionar descrições

  - **Disparar emails em lote** notificando usuários sobre novas fotos

## ✨ Funcionalidades Principais- ✅ **Gestão de Brindes:**

  - CRUD completo

### 🎨 Interface e UX  - Selecionar até 4 brindes visíveis na home

  - Definir ordem de exibição

- ✅ **Design Responsivo** - Totalmente adaptado para mobile, tablet e desktop  - **Sistema de troca:** Confirmação + email automático aos apoiadores

- ✅ **Tema Dual** - Paleta verde para usuários e roxa para administradores- ✅ **Sistema de Resgates:**

- ✅ **Navegação Intuitiva** - Sidebars expansíveis e breadcrumbs  - Configurar dias/horários de retirada

- ✅ **Animações Suaves** - Transições e efeitos visuais modernos  - Visualizar solicitações de resgate

  - Email automático aos admins quando usuário solicita resgate

### 👥 Sistema de Usuários- ⏳ **Editor de Posts (Newsletter):**

  - Editor rico de texto

- ✅ **Autenticação Dual** - Login separado para usuários (`/login`) e admins (`/admin/login`)  - Inserir imagens de animais/brindes

- ✅ **JWT Authentication** - Tokens seguros com refresh automático  - Templates customizáveis

- ✅ **Guards de Rota** - Proteção de páginas por nível de acesso  - Disparar para todos cadastrados ou apenas apoiadores

- ✅ **Perfis Personalizáveis** - Upload de foto de perfil e edição de dados- ⏳ **Dashboard de Assinaturas:**

- ✅ **Recuperação de Senha** - Sistema de reset via email  - Estatísticas por mês/ano/dia

  - Lista de assinantes ativos

### 🐾 Gestão de Animais  - Detalhamento individual

  - Gráficos de crescimento

- ✅ **CRUD Completo** - Criar, visualizar, editar e desativar animais- ✅ **Sistema de Convites Admin:**

- ✅ **Upload de Fotos** - Suporte a múltiplas imagens por animal  - Enviar convite por email (apenas para usuários já cadastrados)

- ✅ **Galeria Inteligente** - Auto-associação de fotos ao criar/editar  - Aceitar convite via link

- ✅ **Troca de Foto de Perfil** - Modal para selecionar entre fotos existentes  - Gerenciar permissões

- ✅ **Filtros Avançados** - Por nome, tipo (cão/gato), status (ativo/inativo)  

### 🔐 Autenticação e Segurança

### 📸 Sistema de Fotos- ✅ Sistema dual: Login regular (`/login`) e admin (`/admin/login`)

- ✅ Guards: `authGuard` e `adminGuard`

- ✅ **Upload Múltiplo** - Envio de várias fotos simultâneas- ✅ JWT token-based authentication

- ✅ **Associação Múltipla** - Vincular uma foto a vários animais- ✅ **Acesso Dual:** Admins podem usar área de cliente E administrativa

- ✅ **Descrições** - Texto descritivo para cada imagem- ✅ Botões visuais indicando área admin (apenas para admins)

- ✅ **Notificações em Lote** - Email automático para apoiadores quando novas fotos são adicionadas

- ✅ **Galeria Exclusiva** - Visualização apenas para usuários autenticados---

- ✅ **Thumbnails Clicáveis** - Filtro visual por animal

## 🛠️ Tecnologias

### 🎁 Sistema de Brindes

### Frontend

- ✅ **CRUD de Brindes** - Gerenciamento completo de itens- **Angular 20.3.6** com Standalone Components

- ✅ **Seleção Destacada** - Admin escolhe até 4 brindes para exibir na home- **TypeScript 5.7** em modo strict

- ✅ **Sistema de Ordem** - Definir ordem de exibição- **SCSS** para estilização

- ✅ **Confirmação de Troca** - Modal com resumo antes de publicar- **RxJS** para programação reativa

- ✅ **Notificação Automática** - Email em lote ao alterar brindes visíveis- **Angular Router** com lazy loading

- ✅ **Resgate por Usuários** - Solicitação de retirada com agendamento- **Control Flow Syntax** (`@if`, `@for`) do Angular 17+



### 📊 Dashboard e Analytics### Backend (Integração Preparada)

- Node.js + Express

- ✅ **Estatísticas em Tempo Real** - KPIs de doações, assinantes e resgates- MongoDB + Mongoose

- ✅ **Filtros Dinâmicos** - Por período (semana/mês/ano) e tipo de plano- JWT Authentication

- ✅ **Gráficos Interativos** - Visualização de dados com Chart.js- Multer/Cloudinary (upload de imagens)

- ✅ **Cards de Resumo** - Total de animais, fotos, apoiadores ativos- Nodemailer (sistema de emails)

- Bull (filas de processamento)

### 📧 Sistema de Emails

### Arquitetura

- ✅ **Templates Personalizados** - Design responsivo para diferentes tipos de email- **Path Aliases:** `@services/`, `@models/`, `@app/`

- ✅ **Disparos em Lote** - Envio para todos ou apenas apoiadores- **Services:** Camada de dados separada

- ✅ **Fila de Processamento** - Sistema Bull para envios assíncronos- **Models:** Interfaces TypeScript tipadas

- ✅ **Confirmações Automáticas** - Email de boas-vindas, confirmação de doação, etc.- **Guards:** Proteção de rotas

- **Lazy Loading:** Módulos carregados sob demanda

### 🔐 Segurança

---

- ✅ **Autenticação JWT** - Tokens com expiração e refresh

- ✅ **Variáveis de Ambiente** - Dados sensíveis protegidos em `.env`## 📦 Instalação

- ✅ **Validação de Formulários** - Client-side e server-side

- ✅ **Proteção CSRF** - Tokens anti-falsificação### Pré-requisitos

- ✅ **Rate Limiting** - Prevenção de ataques de força bruta- Node.js >= 18.x

- npm >= 9.x

---- Angular CLI (`npm install -g @angular/cli`)



## 🛠️ Tecnologias Utilizadas### Passos



### Frontend```bash

# 1. Clone o repositório

| Tecnologia | Versão | Descrição |git clone https://github.com/garra400/PatasSolidarias.git

|------------|--------|-----------|cd PatasSolidarias

| **Angular** | 20.3.6 | Framework principal com Standalone Components |

| **TypeScript** | 5.7 | Superset do JavaScript com tipagem estática |# 2. Instale as dependências

| **SCSS** | - | Pré-processador CSS com variáveis e mixins |npm install

| **RxJS** | 7.8+ | Programação reativa e gerenciamento de estado |

| **Angular Router** | 20.3.6 | Navegação com lazy loading |# 3. Configure o ambiente

| **Chart.js** | 4.x | Gráficos interativos |cp src/environments/environment.example.ts src/environments/environment.ts

# Edite environment.ts com suas configurações

### Backend

# 4. Inicie o servidor de desenvolvimento

| Tecnologia | Versão | Descrição |ng serve

|------------|--------|-----------|

| **Node.js** | 18+ | Runtime JavaScript server-side |# 5. Acesse no navegador

| **Express** | 4.x | Framework web minimalista |# http://localhost:4200

| **MongoDB** | 6+ | Banco de dados NoSQL |```

| **Mongoose** | 8.x | ODM para MongoDB |

| **JWT** | 9.x | Autenticação baseada em tokens |---

| **Multer** | 1.4.x | Upload de arquivos |

| **Nodemailer** | 6.x | Envio de emails |## 📁 Estrutura do Projeto

| **Bull** | 4.x | Filas de processamento |

```

### DevOps e Ferramentassrc/app/

├── components/

- **Git** - Controle de versão│   ├── admin/                    # Componentes administrativos

- **GitHub** - Repositório remoto│   │   ├── auth/

- **VSCode** - IDE principal│   │   │   └── admin-login/      # Login admin (/admin/login)

- **Postman** - Testes de API│   │   ├── dashboard/            # Dashboard principal

- **MongoDB Compass** - Interface para banco de dados│   │   ├── animais/              # CRUD de animais

│   │   ├── fotos/                # Gestão de fotos

---│   │   ├── brindes/              # CRUD de brindes

│   │   ├── gerenciar-brindes/    # Seleção de visíveis

## 📋 Pré-requisitos│   │   ├── posts/                # Newsletter

│   │   ├── assinantes/           # Estatísticas

Antes de começar, certifique-se de ter instalado:│   │   ├── resgates/             # Gerenciar resgates

│   │   └── admins/               # Convites e permissões

```bash│   ├── user/                     # Área do usuário

# Node.js (versão 18 ou superior)│   │   ├── user-layout/          # Layout com sidebar

node --version  # v18.x.x ou maior│   │   ├── seja-apoiador/        # Página de doação

│   │   ├── fotos/                # Galeria exclusiva

# npm (vem com Node.js)│   │   ├── meus-brindes/         # Brindes do usuário

npm --version   # 9.x.x ou maior│   │   └── ...

│   ├── auth/                     # Login/Registro público

# Angular CLI (global)│   ├── shared/                   # Componentes compartilhados

npm install -g @angular/cli│   │   ├── header/               # Header global

ng version      # 20.3.6 ou maior│   │   └── ...

│   └── home/                     # Landing page

# Git├── service/

git --version   # 2.x.x ou maior│   ├── auth.service.ts           # Autenticação

```│   ├── animal.service.ts         # CRUD animais

│   ├── foto.service.ts           # Upload e gestão fotos

---│   ├── brinde.service.ts         # CRUD brindes

│   ├── post.service.ts           # Newsletter

## 📦 Instalação│   ├── resgate.service.ts        # Agendamentos

│   ├── admin.service.ts          # Convites e permissões

### 1. Clone o Repositório│   └── ...

├── model/

```bash│   ├── user.model.ts             # Usuário

git clone https://github.com/garra400/PatasSolidarias.git│   ├── animal.model.ts           # Animal + Foto

cd PatasSolidarias│   ├── brinde.model.ts           # Brinde + Config + Resgate

```│   ├── post.model.ts             # Post + Template

│   └── admin.model.ts            # Convite + Stats

### 2. Instale as Dependências├── guards/

│   ├── auth.guard.ts             # Protege rotas autenticadas

```bash│   └── admin.guard.ts            # Protege rotas admin

# Frontend (raiz do projeto)└── routes/

npm install    ├── app.routes.ts             # Rotas principais

    └── admin.routes.ts           # Rotas administrativas

# Backend (separado)```

cd backend

npm install---

cd ..

```## 🗺️ Rotas



### 3. Configure as Variáveis de Ambiente### Públicas

```

#### Frontend: `src/environments/environment.ts`/                    # Home

/login               # Login usuários

```typescript/registro            # Registro

export const environment = {/recuperar-senha     # Recuperação de senha

  production: false,/confirmar-email     # Confirmação de email

  apiUrl: 'http://localhost:3000/api',```

  mercadoPagoPublicKey: 'SUA_PUBLIC_KEY_AQUI'

};### Área do Usuário (requer autenticação)

``````

/conta                      # Dashboard

#### Backend: `backend/.env`/conta/seja-apoiador        # Página de doação

/conta/doar-novamente       # Doar novamente

```env/conta/fotos                # Galeria exclusiva

# Servidor/conta/meus-brindes         # Brindes resgatados

PORT=3000/conta/pagamentos           # Histórico de pagamentos

NODE_ENV=development/conta/assinatura           # Gerenciar assinatura

/conta/configuracoes        # Configurações

# MongoDB```

MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/patassolidarias

### Área Administrativa (requer admin)

# JWT```

JWT_SECRET=sua_chave_secreta_super_segura_aqui/admin/login                # Login admin (público)

JWT_EXPIRE=7d/admin                      # Dashboard admin

/admin/animais              # Listar animais

# Email (Nodemailer)/admin/animais/novo         # Criar animal

SMTP_HOST=smtp.gmail.com/admin/animais/:id          # Editar animal

SMTP_PORT=587/admin/fotos                # Galeria de fotos

SMTP_USER=seu_email@gmail.com/admin/fotos/upload         # Upload múltiplo

SMTP_PASS=sua_senha_app/admin/brindes              # Listar brindes

/admin/brindes/novo         # Criar brinde

# Mercado Pago/admin/gerenciar-brindes    # Selecionar visíveis

MP_ACCESS_TOKEN=seu_access_token_aqui/admin/posts                # Posts/Newsletter

MP_PUBLIC_KEY=sua_public_key_aqui/admin/posts/novo           # Criar post

/admin/assinantes           # Dashboard assinantes

# URLs/admin/resgates             # Gerenciar resgates

FRONTEND_URL=http://localhost:4200/admin/admins               # Gerenciar admins

``````



### 4. Inicie os Servidores---



#### Terminal 1 - Backend## 📚 Documentação Completa

```bash

cd backendPara documentação detalhada do sistema administrativo, incluindo:

npm start- Fluxos de trabalho completos

# ou para desenvolvimento com nodemon:- Especificação de endpoints backend

npm run dev- Modelos de dados

```- Sistema de emails

- Guia de implementação

#### Terminal 2 - Frontend

```bashConsulte: **[DOCUMENTACAO_SISTEMA_ADMIN.md](./DOCUMENTACAO_SISTEMA_ADMIN.md)**

ng serve

# ou---

npm start

```## 🚀 Desenvolvimento



### 5. Acesse a Aplicação### Servidor de Desenvolvimento

```bash

- **Frontend:** [http://localhost:4200](http://localhost:4200)ng serve

- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)# ou

npm start

---```

Acesse: `http://localhost:4200`

## ⚙️ Configuração

### Build de Produção

### Configuração do MongoDB Atlas```bash

ng build

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)# ou

2. Crie um novo cluster (Free Tier disponível)npm run build

3. Configure um usuário de banco de dados```

4. Whitelist seu IP (ou use `0.0.0.0/0` para desenvolvimento)Artefatos em: `dist/`

5. Copie a connection string para `backend/.env`

### Testes

### Configuração do Mercado Pago```bash

# Testes unitários

1. Crie uma conta em [Mercado Pago Developers](https://www.mercadopago.com.br/developers)ng test

2. Acesse "Suas integrações" → "Credenciais de teste"

3. Copie `Public Key` e `Access Token`# Testes e2e

4. Cole em `backend/.env` e `environment.ts`ng e2e

```

### Configuração de Email (Nodemailer)

### Linting

Para Gmail:```bash

1. Ative a verificação em 2 etapasng lint

2. Gere uma "Senha de App"```

3. Use essa senha em `SMTP_PASS`

### Code Scaffolding

---```bash

# Gerar componente

## 📁 Estrutura do Projetong generate component nome-do-componente



```# Gerar serviço

PatasSolidarias/ng generate service nome-do-servico

├── backend/                      # Servidor Node.js

│   ├── models/                   # Modelos Mongoose# Gerar guard

│   ├── routes/                   # Rotas da APIng generate guard nome-do-guard

│   ├── middleware/               # Middlewares (auth, upload, etc)```

│   ├── utils/                    # Funções utilitárias

│   ├── uploads/                  # Arquivos enviados---

│   ├── server.js                 # Arquivo principal

│   ├── .env.example              # Template de variáveis## 🎨 Guia de Estilo

│   └── package.json

│### Cores

├── src/                          # Código-fonte Angular

│   ├── app/**Admin (Roxo):**

│   │   ├── components/```scss

│   │   │   ├── admin/            # Área administrativa$admin-primary: #667eea;

│   │   │   │   ├── auth/$admin-secondary: #764ba2;

│   │   │   │   │   └── admin-login/```

│   │   │   │   ├── dashboard/

│   │   │   │   ├── animais/**Cliente (Verde):**

│   │   │   │   │   ├── lista-animais/```scss

│   │   │   │   │   ├── form-animal/$user-primary: #10b981;

│   │   │   │   │   └── selecionar-foto-perfil-modal/$user-secondary: #059669;

│   │   │   │   ├── fotos/```

│   │   │   │   │   ├── lista-fotos/

│   │   │   │   │   ├── upload-fotos/### Convenções de Código

│   │   │   │   │   └── fotos-pendentes/

│   │   │   │   ├── brindes/- **Standalone Components:** Todos componentes usam `standalone: true`

│   │   │   │   │   ├── lista-brindes/- **Control Flow:** Usar `@if`, `@for`, `@switch` (Angular 17+)

│   │   │   │   │   ├── form-brinde/- **Path Aliases:** Importar com `@services/`, `@models/`

│   │   │   │   │   └── selecionar-brindes/- **RxJS:** Sempre fazer `unsubscribe` ou usar `async` pipe

│   │   │   │   └── admin-layout/

│   │   │   │---

│   │   │   ├── user/             # Área do usuário

│   │   │   │   ├── dashboard/## 🤝 Contribuindo

│   │   │   │   ├── seja-apoiador/

│   │   │   │   ├── fotos/1. Fork o projeto

│   │   │   │   ├── meus-brindes/2. Crie sua feature branch (`git checkout -b feature/NovaFuncionalidade`)

│   │   │   │   ├── pagamentos/3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)

│   │   │   │   └── user-layout/4. Push para a branch (`git push origin feature/NovaFuncionalidade`)

│   │   │   │5. Abra um Pull Request

│   │   │   ├── auth/             # Autenticação pública

│   │   │   │   ├── login/---

│   │   │   │   └── registro/

│   │   │   │## 📝 Roadmap

│   │   │   ├── shared/           # Componentes compartilhados

│   │   │   │   ├── header/### ✅ Concluído

│   │   │   │   ├── footer/- [x] Estrutura base do projeto

│   │   │   │   ├── chart/- [x] Sistema de autenticação

│   │   │   │   └── trocar-foto-perfil-modal/- [x] Área do usuário completa

│   │   │   │- [x] CRUD de animais, fotos e brindes

│   │   │   └── home/             # Landing page- [x] Login admin separado

│   │   │- [x] Guards e proteção de rotas

│   │   ├── service/              # Serviços- [x] Serviços com mock data

│   │   │   ├── auth.service.ts

│   │   │   ├── animal.service.ts### ⏳ Em Desenvolvimento

│   │   │   ├── foto.service.ts- [ ] Editor de posts com newsletter

│   │   │   ├── brinde.service.ts- [ ] Dashboard de estatísticas

│   │   │   ├── user.service.ts- [ ] Sistema de gráficos

│   │   │   └── ...- [ ] Integração completa com backend

│   │   │- [ ] Testes unitários

│   │   ├── model/                # Modelos/Interfaces

│   │   │   ├── user.model.ts### 🔮 Futuro

│   │   │   ├── animal.model.ts- [ ] Notificações em tempo real (WebSocket)

│   │   │   ├── foto.model.ts- [ ] Sistema de chat admin-usuário

│   │   │   ├── brinde.model.ts- [ ] App mobile (Ionic/React Native)

│   │   │   └── ...- [ ] Painel de analytics avançado

│   │   │

│   │   ├── guards/               # Guards de rota---

│   │   │   ├── auth.guard.ts

│   │   │   └── admin.guard.ts## 📄 Licença

│   │   │

│   │   ├── app.ts                # Componente raizEste projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

│   │   ├── app.routes.ts         # Configuração de rotas

│   │   └── app.config.ts         # Configuração global---

│   │

│   ├── assets/                   # Recursos estáticos## 👥 Equipe

│   ├── environments/             # Configurações de ambiente

│   ├── index.htmlDesenvolvido por:

│   ├── main.ts- **João Victor "Garra" dos Santos Gomes** - Frontend Developer

│   └── styles.scss               # Estilos globais- **UTFPR Medianeira** - Projeto Patas Solidárias

│

├── docs/                         # 📚 Documentação adicional---

│   ├── GUIA_DESENVOLVIMENTO.md   # Guia completo para desenvolvedores

│   ├── LISTA_DE_TESTES.md        # 35+ casos de teste## 📞 Contato

│   ├── MERCADOPAGO-IMPLEMENTATION.md  # Integração Mercado Pago

│   ├── RESUMO_FINAL.md           # Resumo das implementações- **Email:** patassolidarias@utfpr.edu.br

│   └── ROADMAP_FEATURES.md       # Roadmap de funcionalidades- **Instagram:** [@patassolidarias_utfpr](https://instagram.com/patassolidarias_utfpr)

│- **LinkedIn:** [Patas Solidárias](https://linkedin.com/company/patassolidarias)

├── .gitignore                    # Arquivos ignorados pelo Git

├── .editorconfig                 # Configuração de editor---

├── angular.json                  # Configuração Angular CLI

├── package.json                  # Dependências e scripts## 🙏 Agradecimentos

├── tsconfig.json                 # Configuração TypeScript

└── README.md                     # Este arquivo- UTFPR Medianeira

```- Comunidade Angular

- Todos os apoiadores do projeto

> 📖 **Nota:** Toda documentação técnica detalhada foi organizada na pasta `/docs` para manter a raiz do projeto limpa. Consulte os arquivos em `/docs` para guias específicos de desenvolvimento, testes e implementação.

---

---

**Feito com ❤️ e 🐾 por estudantes da UTFPR-MD**

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
| `/admin/fotos/pendentes` | `FotosPendentesComponent` | Aprovar fotos |
| `/admin/brindes` | `ListaBrindesComponent` | Listar brindes |
| `/admin/brindes/novo` | `FormBrindeComponent` | Criar brinde |
| `/admin/brindes/:id` | `FormBrindeComponent` | Editar brinde |
| `/admin/brindes/selecionar` | `SelecionarBrindesComponent` | Escolher visíveis |

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
