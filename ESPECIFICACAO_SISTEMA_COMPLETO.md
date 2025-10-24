# 📋 Especificação Completa do Sistema - Patas Solidárias

## 🎯 Visão Geral

Sistema completo de gerenciamento de animais, fotos, brindes e apoiadores para o projeto Patas Solidárias da UTFPR-MD.

---

## 1. 📸 Sistema de Animais e Galeria

### 1.1 Cadastro de Animais

**Funcionalidade:**
- Admin pode cadastrar novos animais no sistema

**Campos do Formulário:**
- Nome do animal (obrigatório)
- Tipo de animal (gato, cachorro, outros)
- Descrição do animal
- Foto de perfil (upload de imagem)

**Regras de Negócio:**
- ✅ A foto de perfil automaticamente entra na galeria do animal
- ✅ A foto de perfil pode ser trocada posteriormente por qualquer outra foto do animal
- ✅ Admin pode editar qualquer informação do animal depois
- ✅ Animais aparecem na página home em "Conheça nossas patinhas"

**Endpoints Backend:**
```
POST   /api/animais              - Criar animal
GET    /api/animais              - Listar todos os animais
GET    /api/animais/:id          - Obter animal específico
PUT    /api/animais/:id          - Atualizar animal
DELETE /api/animais/:id          - Deletar animal
PUT    /api/animais/:id/foto     - Trocar foto de perfil
```

### 1.2 Sistema de Upload de Fotos

**Funcionalidade:**
- Admin pode fazer upload de múltiplas fotos
- Cada foto pode ter múltiplos animais associados
- Fotos ficam "pendentes" até serem notificadas

**Fluxo de Upload:**
1. Admin acessa "Fotos > Upload"
2. Seleciona múltiplas fotos
3. Para cada foto:
   - Seleciona animal(is) na foto (pode ser mais de um)
   - Adiciona descrição
   - Status inicial: "pendente"
4. Fotos vão para aba "Fotos Pendentes"
5. Quando pronto, admin clica "Disparar Notificações"
6. Sistema:
   - Marca todas fotos pendentes como "publicadas"
   - Envia email para TODOS os usuários cadastrados
   - Email contém: fotos adicionadas + link para galeria

**Campos de uma Foto:**
```typescript
interface Foto {
  id: string;
  url: string;
  descricao: string;
  animais: string[]; // Array de IDs de animais
  status: 'pendente' | 'publicada';
  dataUpload: Date;
  dataPublicacao?: Date;
  uploadedBy: string; // ID do admin
}
```

**Endpoints Backend:**
```
POST   /api/fotos/upload         - Upload múltiplas fotos
GET    /api/fotos/pendentes      - Listar fotos pendentes
POST   /api/fotos/publicar       - Publicar fotos pendentes e enviar emails
GET    /api/fotos                - Listar fotos publicadas
GET    /api/fotos/animal/:id     - Fotos de um animal específico
DELETE /api/fotos/:id            - Deletar foto
```

**Template de Email - Novas Fotos:**
```html
<h2>🐾 Novas fotos dos nossos pets!</h2>
<p>Olá! Acabamos de adicionar novas fotos dos animais do campus.</p>
<p>Confira as novidades na galeria:</p>
<!-- Grid com miniaturas das fotos -->
<a href="{FRONTEND_URL}/conta/fotos">Ver Galeria Completa</a>
```

---

## 2. 🎁 Sistema de Brindes

### 2.1 Cadastro de Brindes

**Funcionalidade:**
- Admin cadastra brindes que podem ser resgatados por apoiadores

**Campos do Formulário:**
- Nome do brinde (ex: "Adesivo Gatinho")
- Descrição
- Foto do brinde
- Estoque inicial
- Ativo (sim/não) - controla se aparece para usuários

**Status do Brinde:**
- `cadastrado`: Brinde existe mas não está disponível
- `disponivel`: Brinde selecionado para resgate
- `esgotado`: Sem estoque

**Endpoints Backend:**
```
POST   /api/brindes              - Criar brinde
GET    /api/brindes              - Listar todos os brindes
GET    /api/brindes/disponiveis  - Brindes disponíveis para resgate
PUT    /api/brindes/:id          - Atualizar brinde
DELETE /api/brindes/:id          - Deletar brinde
```

### 2.2 Seleção de Brindes do Mês

**Funcionalidade:**
- Admin acessa "Brindes > Selecionar para Resgate"
- Vê lista de todos os brindes cadastrados
- Seleciona até 4 brindes para serem resgatáveis
- Ao confirmar seleção:
  - Modal de confirmação: "Deseja trocar os brindes resgatáveis?"
  - Ao confirmar:
    - Marca brindes antigos como `cadastrado`
    - Marca novos brindes como `disponivel`
    - Envia email para TODOS os apoiadores

**Regras:**
- ✅ Máximo 4 brindes disponíveis simultaneamente
- ✅ Brindes aparecem na home em "Confira os adesivos exclusivos"
- ✅ Se houver outros tipos além de adesivos: "Conheça os brindes exclusivos"
- ✅ Email de notificação apenas para apoiadores ativos

**Endpoint Backend:**
```
POST   /api/brindes/selecionar   - Selecionar brindes do mês
```

**Template de Email - Novos Brindes:**
```html
<h2>🎁 Novos brindes disponíveis para resgate!</h2>
<p>Olá apoiador! Temos novos brindes exclusivos esperando por você!</p>
<!-- Grid com fotos dos brindes -->
<p>Você tem {quantidade} brinde(s) disponível(is) para resgate.</p>
<a href="{FRONTEND_URL}/conta/meus-brindes">Resgatar Agora</a>
```

### 2.3 Sistema de Resgate

**Funcionalidade:**
- Apoiador acessa "Meus Brindes"
- Vê brindes disponíveis e quantos pode resgatar
- Clica em "Resgatar"
- Seleciona:
  - Qual brinde deseja
  - Dia da semana (baseado em configuração admin)
  - Horário (baseado em configuração admin)
- Confirma resgate
- Sistema:
  - Registra resgate com status "pendente"
  - Deduz 1 brinde disponível do usuário
  - Envia email para TODOS os admins
  - Atualiza estoque do brinde (-1)

**Campos do Resgate:**
```typescript
interface Resgate {
  id: string;
  usuario: string; // ID do usuário
  brinde: string; // ID do brinde
  dataRetirada: Date;
  horarioRetirada: string; // ex: "14:00-15:00"
  status: 'pendente' | 'retirado' | 'cancelado';
  observacoes?: string;
  criadoEm: Date;
}
```

**Endpoints Backend:**
```
POST   /api/resgates             - Solicitar resgate
GET    /api/resgates             - Listar resgates do usuário
GET    /api/admin/resgates       - Listar todos os resgates (admin)
PUT    /api/resgates/:id/status  - Atualizar status (admin)
```

**Template de Email - Solicitação de Resgate (para Admins):**
```html
<h2>📦 Nova solicitação de resgate</h2>
<p><strong>Apoiador:</strong> {nome} ({email})</p>
<p><strong>Brinde:</strong> {brinde_nome}</p>
<p><strong>Data:</strong> {data_retirada}</p>
<p><strong>Horário:</strong> {horario}</p>
<a href="{FRONTEND_URL}/admin/resgates">Gerenciar Resgates</a>
```

### 2.4 Configuração de Horários de Resgate

**Funcionalidade:**
- Admin acessa "Resgates > Configurar Horários"
- Define:
  - Dias da semana disponíveis (checkbox)
  - Horários disponíveis por dia
  - Ex: Segunda 14:00-15:00, 16:00-17:00

**Interface:**
```typescript
interface ConfigResgateHorario {
  diaSemana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  horarios: string[]; // ['14:00-15:00', '16:00-17:00']
  ativo: boolean;
}
```

**Endpoint Backend:**
```
GET    /api/resgates/config      - Obter configuração
PUT    /api/resgates/config      - Atualizar configuração
```

---

## 3. 📰 Sistema de Newsletter/Posts

### 3.1 Editor de Posts

**Funcionalidade:**
- Admin pode criar posts HTML personalizados
- Editor visual com templates modificáveis
- Pode inserir:
  - Imagens de animais (da galeria)
  - Imagens de brindes
  - Texto formatado (negrito, itálico, listas)
  - Links

**Interface do Editor:**
- Usa Quill.js ou TinyMCE
- Biblioteca de imagens:
  - Aba "Animais" - mostra fotos dos animais
  - Aba "Brindes" - mostra fotos dos brindes
  - Aba "Upload" - upload de imagens customizadas

**Campos do Post:**
```typescript
interface Post {
  id: string;
  titulo: string;
  conteudo: string; // HTML
  tipo: 'newsletter' | 'noticia';
  status: 'rascunho' | 'agendado' | 'enviado';
  destinatarios: 'todos' | 'apoiadores';
  criadoEm: Date;
  enviadoEm?: Date;
  criadoPor: string; // ID do admin
}
```

**Endpoints Backend:**
```
POST   /api/posts                - Criar post
GET    /api/posts                - Listar posts
GET    /api/posts/:id            - Obter post
PUT    /api/posts/:id            - Atualizar post
DELETE /api/posts/:id            - Deletar post
POST   /api/posts/:id/enviar     - Disparar email
```

### 3.2 Disparo de Emails

**Funcionalidade:**
- Admin revisa post no editor
- Escolhe destinatários:
  - [ ] Todos os membros cadastrados
  - [ ] Apenas apoiadores
- Clica "Disparar Email"
- Sistema:
  - Envia email para destinatários selecionados
  - Marca post como "enviado"
  - Registra data de envio

**Template de Email - Post Personalizado:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Estilos da newsletter */
  </style>
</head>
<body>
  <div class="header">
    <img src="logo.png" alt="Patas Solidárias">
  </div>
  
  <div class="content">
    {CONTEUDO_DO_POST}
  </div>
  
  <div class="footer">
    <p>Você está recebendo este email porque é cadastrado no Patas Solidárias.</p>
    <a href="{FRONTEND_URL}">Visitar Site</a>
  </div>
</body>
</html>
```

---

## 4. 👥 Sistema de Apoiadores/Assinantes

### 4.1 Listagem de Apoiadores

**Funcionalidade:**
- Admin vê lista de todos os apoiadores
- Informações exibidas:
  - Nome
  - Email
  - Data de entrada
  - Meses de apoio
  - Status da assinatura (ativa/cancelada)
  - Brindes disponíveis
  - Último pagamento

**Filtros:**
- Status: Ativos | Inativos | Todos
- Ordenar por: Nome | Data de entrada | Meses de apoio

**Endpoint Backend:**
```
GET    /api/admin/assinantes     - Listar apoiadores
GET    /api/admin/assinantes/:id - Detalhes do apoiador
```

### 4.2 Estatísticas de Apoiadores

**Funcionalidade:**
- Admin acessa "Assinantes > Estatísticas"
- Visualiza gráficos e métricas:

**Métricas Gerais:**
- Total de apoiadores ativos
- Total de apoiadores histórico
- Taxa de retenção mensal
- Receita total arrecadada

**Gráficos:**
1. **Evolução Mensal de Apoiadores**
   - Linha do tempo
   - Novos apoiadores por mês
   - Cancelamentos por mês
   - Saldo líquido

2. **Apoiadores por Mês (histórico)**
   - Qual mês teve mais novos apoiadores
   - Ranking de meses

3. **Apoiadores por Dia da Semana**
   - Qual dia da semana tem mais cadastros

4. **Tempo Médio de Apoio**
   - Distribuição de apoiadores por tempo de apoio
   - Ex: 1-3 meses, 3-6 meses, 6-12 meses, 12+ meses

**Endpoint Backend:**
```
GET    /api/admin/estatisticas/apoiadores  - Dados para gráficos
```

**Resposta da API:**
```typescript
interface EstatisticasApoiadores {
  totais: {
    ativos: number;
    historico: number;
    receitaTotal: number;
    ticketMedio: number;
  };
  evolucaoMensal: {
    mes: string;
    novos: number;
    cancelamentos: number;
    saldo: number;
  }[];
  porMes: {
    mes: string;
    total: number;
  }[];
  porDiaSemana: {
    dia: string;
    total: number;
  }[];
  tempoMedioApoio: {
    faixa: string;
    quantidade: number;
  }[];
}
```

---

## 5. 👨‍💼 Sistema de Administradores

### 5.1 Convite de Novos Admins

**Funcionalidade:**
- Admin acessa "Administradores > Convidar"
- Digita email de usuário JÁ CADASTRADO no sistema
- Sistema valida:
  - ✅ Usuário existe no sistema
  - ✅ Usuário não é admin ainda
- Envia email com link de confirmação
- Usuário clica no link no email
- Usuário confirma que aceita ser admin
- Sistema:
  - Promove usuário a admin
  - Envia email de confirmação

**Regras:**
- ❌ Não pode convidar quem não está cadastrado
- ❌ Não pode convidar quem já é admin
- ✅ Um admin pode ser apoiador simultaneamente

**Endpoints Backend:**
```
POST   /api/admin/convites           - Enviar convite
GET    /api/admin/convites           - Listar convites pendentes
POST   /api/admin/convites/:token    - Aceitar convite
DELETE /api/admin/convites/:id       - Cancelar convite
```

**Template de Email - Convite Admin:**
```html
<h2>🛡️ Você foi convidado para ser administrador!</h2>
<p>Olá {nome}!</p>
<p>Você foi convidado por {admin_nome} para fazer parte da equipe de administradores do Patas Solidárias.</p>
<p><strong>Como administrador, você poderá:</strong></p>
<ul>
  <li>Gerenciar animais e fotos</li>
  <li>Cadastrar e gerenciar brindes</li>
  <li>Enviar newsletters</li>
  <li>Visualizar apoiadores</li>
  <li>E muito mais!</li>
</ul>
<a href="{FRONTEND_URL}/admin/aceitar-convite/{token}">Aceitar Convite</a>
<p><small>Este convite expira em 7 dias.</small></p>
```

### 5.2 Gerenciamento de Admins

**Funcionalidade:**
- Admin vê lista de todos os administradores
- Pode:
  - Ver convites pendentes
  - Cancelar convites pendentes
  - Remover privilégios de admin (com confirmação)

**Interface:**
```
Administradores Ativos (5)
├─ João Silva (Admin Principal)
├─ Maria Santos 
├─ Pedro Costa
└─ Ana Lima

Convites Pendentes (2)
├─ carlos@email.com (enviado há 2 dias)
└─ julia@email.com (enviado há 5 dias)
```

**Endpoint Backend:**
```
GET    /api/admin/admins             - Listar admins
DELETE /api/admin/admins/:id         - Remover admin
```

---

## 6. 🏠 Página Home - Integrações

### 6.1 Seção "Conheça Nossas Patinhas"

**Funcionalidade:**
- Exibe cards dos animais cadastrados
- Dados vêm do backend

**Cada Card Mostra:**
- Foto de perfil do animal
- Nome do animal
- Descrição resumida (máx 150 caracteres)
- Link "Saiba mais" → abre modal com descrição completa

**Endpoint:**
```
GET    /api/animais/publicos    - Animais para exibição pública
```

### 6.2 Seção "Brindes Exclusivos"

**Funcionalidade:**
- Exibe até 4 brindes selecionados pelos admins
- Título dinâmico:
  - Se só adesivos: "Confira os adesivos exclusivos dos nossos pets"
  - Se outros tipos: "Conheça os brindes exclusivos dos nossos pets"

**Cada Card Mostra:**
- Foto do brinde
- Nome do brinde
- Botão "Seja Apoiador" (se não logado)
- Botão "Resgatar" (se apoiador)

**Endpoint:**
```
GET    /api/brindes/destaque    - Brindes em destaque
```

---

## 7. 🔐 Sistema de Autenticação Admin

### 7.1 Login de Admin

**Rota:** `/admin/login`

**Funcionalidade:**
- Página de login separada para admins
- Campos:
  - Email
  - Senha
- Valida credenciais
- Verifica se usuário é admin
- Redireciona para `/admin/dashboard`

**Regras:**
- ✅ Mesmo sistema de autenticação (JWT)
- ✅ Mesma tabela de usuários
- ✅ Verifica campo `role === 'admin'`
- ✅ Admin também pode acessar área de usuário `/conta`

### 7.2 Duplo Papel

**Funcionalidade:**
- Um admin pode ser apoiador
- Tem acesso às duas áreas:
  - `/conta` - área de apoiador
  - `/admin` - área administrativa

**Interface:**
- No menu do usuário, se for admin:
  - Link "Área do Cliente" → vai para `/conta`
  - Link "Painel Admin" → vai para `/admin`

---

## 8. 📊 Implementação por Prioridade

### Sprint 1 - Essencial (Semana 1-2)
1. ✅ Sistema de animais (CRUD básico)
2. ✅ Upload de fotos pendentes
3. ✅ Publicação de fotos + email
4. ✅ Exibir animais na home

### Sprint 2 - Brindes (Semana 3-4)
5. ✅ CRUD de brindes
6. ✅ Seleção de brindes do mês + email
7. ✅ Configuração de horários de resgate
8. ✅ Sistema de resgate de brindes
9. ✅ Exibir brindes na home

### Sprint 3 - Newsletter (Semana 5)
10. ✅ Editor de posts (Quill.js)
11. ✅ Biblioteca de imagens (animais + brindes)
12. ✅ Disparo de newsletter

### Sprint 4 - Estatísticas (Semana 6)
13. ✅ Listagem de apoiadores
14. ✅ Estatísticas e gráficos (Chart.js)
15. ✅ Filtros e exportação

### Sprint 5 - Administração (Semana 7)
16. ✅ Sistema de convites admin
17. ✅ Gerenciamento de admins
18. ✅ Login admin separado

### Sprint 6 - Polimento (Semana 8)
19. ✅ Testes completos
20. ✅ Ajustes de UX
21. ✅ Documentação final

---

## 9. 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Angular 20.3.6
- **Editor:** Quill.js (rich text editor)
- **Gráficos:** Chart.js
- **Upload:** ng2-file-upload
- **Notificações:** sweetalert2

### Backend
- **Framework:** Node.js + Express
- **Banco:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Email:** Nodemailer
- **Upload:** Multer + Cloudinary
- **Jobs:** Bull (fila de emails)

### DevOps
- **Versionamento:** Git + GitHub
- **Deploy Backend:** Heroku / Railway
- **Deploy Frontend:** Vercel / Netlify
- **Banco:** MongoDB Atlas

---

## 10. 📧 Resumo de Emails Automatizados

| Evento | Destinatários | Template |
|--------|--------------|----------|
| Novas fotos publicadas | Todos os usuários | email-novas-fotos.html |
| Novos brindes disponíveis | Apoiadores ativos | email-novos-brindes.html |
| Solicitação de resgate | Todos os admins | email-solicitacao-resgate.html |
| Newsletter customizada | Todos OU Apoiadores | email-newsletter.html |
| Convite admin | Usuário específico | email-convite-admin.html |
| Admin aceito | Admin que convidou | email-admin-aceito.html |

---

## 11. 🎨 Componentes a Criar

### Admin - Animais
- [x] `AnimaisListComponent` - Lista de animais
- [ ] `AnimalFormComponent` - Cadastro/edição
- [ ] `AnimalCardComponent` - Card do animal
- [ ] `TrocarFotoPerfilModalComponent` - Modal para trocar foto

### Admin - Fotos
- [x] `FotosListComponent` - Galeria de fotos
- [ ] `FotoUploadComponent` - Upload múltiplo
- [ ] `FotosPendentesComponent` - Fotos não publicadas
- [ ] `SelecionarAnimaisModalComponent` - Associar animais

### Admin - Brindes
- [x] `BrindesListComponent` - Lista de brindes
- [ ] `BrindeFormComponent` - Cadastro/edição
- [ ] `BrindesSelecionarComponent` - Selecionar para resgate
- [ ] `ConfirmacaoTrocaBrindesModalComponent`

### Admin - Resgates
- [x] `ResgatesListComponent` - Solicitações
- [ ] `ResgatesHorariosComponent` - Config horários
- [ ] `ResgateDetalheModalComponent` - Detalhes

### Admin - Posts
- [x] `PostsListComponent` - Lista de posts
- [ ] `PostEditorComponent` - Editor com Quill
- [ ] `BibliotecaImagensComponent` - Biblioteca de imagens
- [ ] `SelecionarDestinatariosModalComponent`

### Admin - Assinantes
- [x] `AssinantesListComponent` - Lista
- [ ] `AssinantesStatsComponent` - Gráficos
- [ ] `AssinanteDetalheComponent` - Perfil completo

### Admin - Administradores
- [x] `AdminsListComponent` - Lista de admins
- [ ] `AdminInviteComponent` - Enviar convite
- [ ] `AceitarConviteComponent` - Página de aceitação

### User - Ajustes
- [ ] Atualizar `HomeComponent` para consumir API
- [ ] Atualizar cards de animais
- [ ] Atualizar cards de brindes
- [ ] Modal de resgate com seleção de horários

---

**Status Atual:** ✅ Backend completo | ⏳ Frontend 30% | 🎯 Próximo: Componentes Admin

**Última atualização:** 23/10/2025
