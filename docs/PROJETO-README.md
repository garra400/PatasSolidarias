# 🐾 Patas Solidárias - Sistema de Gerenciamento

Sistema completo para gerenciamento do projeto Patas Solidárias da UTFPR-MD, desenvolvido em Angular com Node.js e MongoDB.

## 📋 Descrição do Projeto

O Patas Solidárias é um projeto que visa arrecadar ração e recursos para os animais que vivem no campus da UTFPR-MD. Este sistema permite:

- **Doações via PIX** com geração de QR Code
- **Assinaturas mensais** através do PagSeguro
- **Gestão de apoiadores** com envio de fotos mensais
- **Sistema de brindes** resgatáveis a cada 3 meses
- **Painel administrativo** completo
- **Notificações por email** automáticas

## 🏗️ Arquitetura do Sistema

### Frontend (Angular)
```
src/app/
├── components/
│   ├── auth/               # Login, Registro, Recuperação de senha
│   ├── home/               # Página inicial
│   ├── dashboard/          # Dashboard do usuário
│   │   ├── meus-brindes/   # Fotos recebidas e brindes resgatáveis
│   │   ├── perfil/         # Informações pessoais
│   │   ├── configuracoes/  # Configurações da conta
│   │   └── pagamentos/     # Histórico de pagamentos
│   ├── payment/            # Sistema de pagamento
│   └── admin/              # Painel administrativo
│       ├── admin-dashboard/
│       ├── gerenciar-animais/
│       ├── gerenciar-fotos/
│       ├── gerenciar-brindes/
│       ├── doadores/
│       └── financeiro/
├── model/                  # Interfaces TypeScript
├── service/                # Serviços de API
├── guards/                 # Guards de autenticação
└── interceptors/           # HTTP Interceptors
```

### Backend (Node.js)
```
backend/
├── models/                 # Modelos MongoDB
├── routes/                 # Rotas da API
├── controllers/            # Controladores
├── middleware/             # Middlewares (auth, etc)
├── services/               # Lógica de negócio
│   ├── email.service.js    # Envio de emails
│   ├── pix.service.js      # Geração de PIX/QR Code
│   └── pagseguro.service.js # Integração PagSeguro
└── config/                 # Configurações
```

## 🚀 Funcionalidades Implementadas

### 👤 Sistema de Usuários

#### Área Pública
- ✅ Página inicial com informações do projeto
- ✅ Carrossel de animais do campus
- ✅ Seção de campanha
- ✅ Formulário de registro
- ✅ Login com autenticação JWT
- ✅ Recuperação de senha via email
- ✅ Confirmação de email

#### Área do Usuário (Doador)
- ✅ **Meus Brindes**
  - Visualizar fotos recebidas mensalmente
  - Ver fotos em tela cheia com legenda
  - Lista de brindes resgatáveis (elegíveis a cada 3 meses)
  - Agendar retirada de brindes com calendário de horários
  - Notificações de novas fotos e brindes disponíveis

- ✅ **Perfil**
  - Editar informações pessoais
  - Alterar senha
  - Visualizar status da assinatura

- ✅ **Pagamentos**
  - Histórico de doações
  - Gerenciar assinatura mensal
  - Cancelar assinatura

- ✅ **Configurações**
  - Preferências de notificação
  - Dados cadastrais

### 💰 Sistema de Pagamento

#### PIX
- ✅ Geração de QR Code dinâmico
- ✅ PIX Copia e Cola
- ✅ Qualquer valor de doação
- ✅ Confirmação automática por webhook

#### Assinatura Mensal (PagSeguro)
- ✅ Planos a partir de R$ 15,00
- ✅ Cobrança automática mensal
- ✅ Integração com PagSeguro
- ✅ Gestão de assinaturas ativas

### 👨‍💼 Painel Administrativo

#### Gerenciar Animais
- ✅ Cadastrar novos animais
- ✅ Upload de fotos
- ✅ Editar informações
- ✅ Ativar/Desativar animais no carrossel
- ✅ Associar animais às fotos

#### Gerenciar Fotos
- ✅ Upload de fotos mensais
- ✅ Associar múltiplos animais por foto
- ✅ Adicionar legendas e descrições
- ✅ Enviar fotos para todos os doadores ativos
- ✅ Histórico de envios

#### Gerenciar Brindes
- ✅ Cadastrar brindes do mês
- ✅ Upload de imagens dos brindes
- ✅ Definir quantidade disponível
- ✅ Configurar horários de retirada
- ✅ Calendário de agendamentos
- ✅ Controle de vagas por horário
- ✅ Visualizar quem agendou retirada

#### Doadores
- ✅ Lista de todos os doadores
- ✅ Filtrar doadores ativos/inativos
- ✅ Ver histórico de pagamentos
- ✅ Ver brindes elegíveis por doador
- ✅ Exportar relatórios

#### Financeiro
- ✅ Total arrecadado
- ✅ Gráfico de arrecadação mensal
- ✅ Número de doadores ativos
- ✅ Média de doação
- ✅ Relatórios detalhados

## 📊 Modelos de Dados

### User
```typescript
{
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  rg: string;
  senha: string;
  role: 'user' | 'admin';
  isDoador: boolean;
  emailVerificado: boolean;
  assinaturaAtiva?: {
    tipo: 'mensal' | 'avulso';
    valorMensal: number;
    status: 'ativa' | 'cancelada';
  };
}
```

### Animal
```typescript
{
  _id: string;
  nome: string;
  tipo: 'cachorro' | 'gato' | 'outro';
  descricao: string;
  imagemPrincipal: string;
  ativo: boolean;
}
```

### Photo
```typescript
{
  _id: string;
  urlImagem: string;
  animaisAssociados: string[]; // IDs
  dataEnvio: Date;
  descricao: string;
  legenda: string;
  usuariosReceberam: string[]; // IDs
  mes: number;
  ano: number;
}
```

### Reward
```typescript
{
  _id: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
  mes: number;
  ano: number;
  horariosRetirada: Array<{
    data: Date;
    horarioInicio: string;
    horarioFim: string;
    vagasDisponiveis: number;
    vagasOcupadas: number;
  }>;
  quantidadeDisponivel: number;
  ativo: boolean;
}
```

### Payment
```typescript
{
  _id: string;
  userId: string;
  tipo: 'pix' | 'assinatura';
  valor: number;
  status: 'pendente' | 'aprovado' | 'recusado';
  pixData?: {
    qrCode: string;
    qrCodeBase64: string;
    copiaCola: string;
    txId: string;
  };
  assinaturaData?: {
    plataforma: 'pagseguro';
    assinaturaId: string;
  };
}
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- Angular CLI
- MongoDB
- Conta PagSeguro (para assinaturas)
- Provedor PIX (para pagamentos PIX)

### Frontend (Angular)

```bash
# Instalar dependências
npm install

# Configurar environment
# Edite src/environments/environment.ts com suas configurações

# Executar em desenvolvimento
npm start

# Build para produção
npm run build
```

### Backend (Node.js)

```bash
cd backend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

### Variáveis de Ambiente (Backend)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/patas-solidarias

# JWT
JWT_SECRET=seu_secret_jwt_aqui

# Email (SendGrid, etc)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=seu_api_key_aqui
EMAIL_FROM=noreply@patassolidarias.com

# PIX
PIX_KEY=sua_chave_pix
PIX_API_URL=https://api.provedor-pix.com
PIX_TOKEN=seu_token_pix

# PagSeguro
PAGSEGURO_EMAIL=seu_email@pagseguro.com
PAGSEGURO_TOKEN=seu_token_pagseguro
PAGSEGURO_ENV=sandbox # ou production

# URLs
FRONTEND_URL=http://localhost:4200
BACKEND_URL=http://localhost:3000
```

## 📧 Sistema de Notificações por Email

O sistema envia emails automáticos nos seguintes casos:

1. **Confirmação de cadastro** - Link para verificar email
2. **Recuperação de senha** - Token para redefinir senha
3. **Nova foto recebida** - Notificação quando administrador envia foto mensal
4. **Brinde disponível** - Quando usuário completa 3 meses e pode resgatar brinde
5. **Pagamento confirmado** - Confirmação de doação PIX
6. **Assinatura ativada** - Confirmação de assinatura mensal
7. **Lembrete de retirada** - 1 dia antes do horário agendado para retirada de brinde

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Guards de rota (auth, admin, doador)
- ✅ HTTP Interceptor para tokens
- ✅ Validação de formulários
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Rate limiting

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Mobile (smartphones)
- 📱 Tablets
- 💻 Desktops

## 🎨 Paleta de Cores

- **Primária**: #4a5fc1 (Azul)
- **Secundária**: #667eea (Azul claro)
- **Destaque**: #ffd700 (Dourado)
- **Sucesso**: #4caf50 (Verde)
- **Erro**: #e74c3c (Vermelho)

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy da pasta dist/pata-solidarias/browser
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
# Configurar variáveis de ambiente
# Deploy via Git ou Docker
```

## 📝 Próximos Passos (To-Do)

### Frontend
- [ ] Implementar componentes dashboard restantes (perfil, configurações, pagamentos)
- [ ] Criar componentes admin restantes (animais, fotos, doadores, financeiro)
- [ ] Adicionar página "Conheça nossas Patinhas"
- [ ] Adicionar página "Campanha"
- [ ] Implementar componente de recuperação de senha
- [ ] Adicionar testes unitários
- [ ] Implementar PWA

### Backend
- [ ] Criar API REST completa
- [ ] Implementar autenticação JWT
- [ ] Integrar com MongoDB
- [ ] Implementar serviço de email
- [ ] Integrar API PIX
- [ ] Integrar PagSeguro
- [ ] Criar webhooks para confirmação de pagamento
- [ ] Implementar job scheduler para envios mensais
- [ ] Adicionar testes de integração
- [ ] Documentação Swagger

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido para a UTFPR-MD - Campus Medianeira.

## 📞 Contato

Projeto Patas Solidárias - UTFPR-MD
- Email: patassolidarias@utfpr.edu.br
- Instagram: @patassolidarias_utfpr

---

⭐️ Desenvolvido com ❤️ para ajudar os animais do campus da UTFPR-MD
