# 🐾 Patas Solidárias - UTFPR Medianeira

Sistema completo de gerenciamento para o projeto de cuidado aos animais da UTFPR-MD, com área pública, área do usuário e painel administrativo completo.

![Angular](https://img.shields.io/badge/Angular-20.3.6-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Documentação Completa](#documentação-completa)
- [Desenvolvimento](#desenvolvimento)

---

## 🎯 Sobre o Projeto

Patas Solidárias é uma plataforma para gerenciar doações, assinaturas, galeria de fotos e brindes para os animais cuidados pela UTFPR Medianeira. O sistema possui:

- **Área Pública:** Landing page com informações sobre os animais e campanha
- **Área do Usuário:** Gerenciamento de doações, galeria exclusiva e resgate de brindes
- **Painel Admin:** Sistema completo de gestão de conteúdo, usuários e estatísticas

---

## ✨ Funcionalidades

### 🌐 Área Pública
- ✅ Landing page responsiva
- ✅ Galeria de animais cadastrados
- ✅ Informações sobre a campanha
- ✅ Sistema de login/registro

### 👤 Área do Usuário (`/conta`)
- ✅ Dashboard personalizado
- ✅ Sistema de doações (PIX e assinatura recorrente)
- ✅ Galeria exclusiva de fotos dos pets
- ✅ Resgate de brindes
- ✅ Histórico de pagamentos
- ✅ Gerenciamento de assinatura
- ✅ Configurações de perfil

### 🛡️ Painel Administrativo (`/admin`)
- ✅ **Login Separado:** Autenticação dedicada em `/admin/login`
- ✅ **Dashboard:** Estatísticas gerais e KPIs
- ✅ **Gestão de Animais:**
  - CRUD completo
  - Upload de foto de perfil
  - Trocar foto de perfil entre fotos existentes
  - Ativar/desativar animais
- ✅ **Gestão de Fotos:**
  - Upload múltiplo
  - Associar fotos a múltiplos animais
  - Adicionar descrições
  - **Disparar emails em lote** notificando usuários sobre novas fotos
- ✅ **Gestão de Brindes:**
  - CRUD completo
  - Selecionar até 4 brindes visíveis na home
  - Definir ordem de exibição
  - **Sistema de troca:** Confirmação + email automático aos apoiadores
- ✅ **Sistema de Resgates:**
  - Configurar dias/horários de retirada
  - Visualizar solicitações de resgate
  - Email automático aos admins quando usuário solicita resgate
- ⏳ **Editor de Posts (Newsletter):**
  - Editor rico de texto
  - Inserir imagens de animais/brindes
  - Templates customizáveis
  - Disparar para todos cadastrados ou apenas apoiadores
- ⏳ **Dashboard de Assinaturas:**
  - Estatísticas por mês/ano/dia
  - Lista de assinantes ativos
  - Detalhamento individual
  - Gráficos de crescimento
- ✅ **Sistema de Convites Admin:**
  - Enviar convite por email (apenas para usuários já cadastrados)
  - Aceitar convite via link
  - Gerenciar permissões
  
### 🔐 Autenticação e Segurança
- ✅ Sistema dual: Login regular (`/login`) e admin (`/admin/login`)
- ✅ Guards: `authGuard` e `adminGuard`
- ✅ JWT token-based authentication
- ✅ **Acesso Dual:** Admins podem usar área de cliente E administrativa
- ✅ Botões visuais indicando área admin (apenas para admins)

---

## 🛠️ Tecnologias

### Frontend
- **Angular 20.3.6** com Standalone Components
- **TypeScript 5.7** em modo strict
- **SCSS** para estilização
- **RxJS** para programação reativa
- **Angular Router** com lazy loading
- **Control Flow Syntax** (`@if`, `@for`) do Angular 17+

### Backend (Integração Preparada)
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer/Cloudinary (upload de imagens)
- Nodemailer (sistema de emails)
- Bull (filas de processamento)

### Arquitetura
- **Path Aliases:** `@services/`, `@models/`, `@app/`
- **Services:** Camada de dados separada
- **Models:** Interfaces TypeScript tipadas
- **Guards:** Proteção de rotas
- **Lazy Loading:** Módulos carregados sob demanda

---

## 📦 Instalação

### Pré-requisitos
- Node.js >= 18.x
- npm >= 9.x
- Angular CLI (`npm install -g @angular/cli`)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/garra400/PatasSolidarias.git
cd PatasSolidarias

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp src/environments/environment.example.ts src/environments/environment.ts
# Edite environment.ts com suas configurações

# 4. Inicie o servidor de desenvolvimento
ng serve

# 5. Acesse no navegador
# http://localhost:4200
```

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

### Públicas
```
/                    # Home
/login               # Login usuários
/registro            # Registro
/recuperar-senha     # Recuperação de senha
/confirmar-email     # Confirmação de email
```

### Área do Usuário (requer autenticação)
```
/conta                      # Dashboard
/conta/seja-apoiador        # Página de doação
/conta/doar-novamente       # Doar novamente
/conta/fotos                # Galeria exclusiva
/conta/meus-brindes         # Brindes resgatados
/conta/pagamentos           # Histórico de pagamentos
/conta/assinatura           # Gerenciar assinatura
/conta/configuracoes        # Configurações
```

### Área Administrativa (requer admin)
```
/admin/login                # Login admin (público)
/admin                      # Dashboard admin
/admin/animais              # Listar animais
/admin/animais/novo         # Criar animal
/admin/animais/:id          # Editar animal
/admin/fotos                # Galeria de fotos
/admin/fotos/upload         # Upload múltiplo
/admin/brindes              # Listar brindes
/admin/brindes/novo         # Criar brinde
/admin/gerenciar-brindes    # Selecionar visíveis
/admin/posts                # Posts/Newsletter
/admin/posts/novo           # Criar post
/admin/assinantes           # Dashboard assinantes
/admin/resgates             # Gerenciar resgates
/admin/admins               # Gerenciar admins
```

---

## 📚 Documentação Completa

Para documentação detalhada do sistema administrativo, incluindo:
- Fluxos de trabalho completos
- Especificação de endpoints backend
- Modelos de dados
- Sistema de emails
- Guia de implementação

Consulte: **[DOCUMENTACAO_SISTEMA_ADMIN.md](./DOCUMENTACAO_SISTEMA_ADMIN.md)**

---

## 🚀 Desenvolvimento

### Servidor de Desenvolvimento
```bash
ng serve
# ou
npm start
```
Acesse: `http://localhost:4200`

### Build de Produção
```bash
ng build
# ou
npm run build
```
Artefatos em: `dist/`

### Testes
```bash
# Testes unitários
ng test

# Testes e2e
ng e2e
```

### Linting
```bash
ng lint
```

### Code Scaffolding
```bash
# Gerar componente
ng generate component nome-do-componente

# Gerar serviço
ng generate service nome-do-servico

# Gerar guard
ng generate guard nome-do-guard
```

---

## 🎨 Guia de Estilo

### Cores

**Admin (Roxo):**
```scss
$admin-primary: #667eea;
$admin-secondary: #764ba2;
```

**Cliente (Verde):**
```scss
$user-primary: #10b981;
$user-secondary: #059669;
```

### Convenções de Código

- **Standalone Components:** Todos componentes usam `standalone: true`
- **Control Flow:** Usar `@if`, `@for`, `@switch` (Angular 17+)
- **Path Aliases:** Importar com `@services/`, `@models/`
- **RxJS:** Sempre fazer `unsubscribe` ou usar `async` pipe

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Roadmap

### ✅ Concluído
- [x] Estrutura base do projeto
- [x] Sistema de autenticação
- [x] Área do usuário completa
- [x] CRUD de animais, fotos e brindes
- [x] Login admin separado
- [x] Guards e proteção de rotas
- [x] Serviços com mock data

### ⏳ Em Desenvolvimento
- [ ] Editor de posts com newsletter
- [ ] Dashboard de estatísticas
- [ ] Sistema de gráficos
- [ ] Integração completa com backend
- [ ] Testes unitários

### 🔮 Futuro
- [ ] Notificações em tempo real (WebSocket)
- [ ] Sistema de chat admin-usuário
- [ ] App mobile (Ionic/React Native)
- [ ] Painel de analytics avançado

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido por:
- **Gabriel Garra** - Frontend Developer
- **UTFPR Medianeira** - Projeto Patas Solidárias

---

## 📞 Contato

- **Email:** patassolidarias@utfpr.edu.br
- **Instagram:** [@patassolidarias_utfpr](https://instagram.com/patassolidarias_utfpr)
- **LinkedIn:** [Patas Solidárias](https://linkedin.com/company/patassolidarias)

---

## 🙏 Agradecimentos

- UTFPR Medianeira
- Comunidade Angular
- Todos os apoiadores do projeto

---

**Feito com ❤️ e 🐾 por estudantes da UTFPR-MD**
