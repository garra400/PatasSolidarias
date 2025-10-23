# Backend API - Sistema Admin Completo

## ✅ Status: CONCLUÍDO

### 📦 Models Criados (7 novos + 2 atualizados)

#### Novos Models:
1. **foto.model.js** - Galeria de fotos
   - url, descricao, animaisIds[], adicionadaPor, emailEnviado
   
2. **brinde.model.js** - Gerenciamento de brindes
   - nome, descricao, fotoUrl, disponivelParaResgate, ordem

3. **configuracao-resgate.model.js** - Configuração de horários
   - diasSemana[], horariosDisponiveis[], intervaloMinutos, mensagemInformativa
   - Método: `getConfig()` - Singleton pattern

4. **solicitacao-resgate.model.js** - Solicitações de resgate
   - usuarioId, brindeId, dataHorarioEscolhido, status, observacoes

5. **post.model.js** - Newsletter/Posts
   - titulo, conteudoHtml, imagensAnimais[], imagensBrindes[], destinatarios, status

6. **email-post.model.js** - Tracking de emails
   - postId, usuarioId, aberto, dataAbertura, token

7. **convite-admin.model.js** - Convites admin
   - emailConvidado, token, permissoes{}, status, dataExpiracao
   - Método: `isValido()`

#### Models Atualizados:
8. **animal.model.js** - Adicionado suporte a fotos
   - Novo campo: `fotoPerfilId` (ref: Foto)
   - Convertido para ES6 modules

9. **user.model.js** - Sistema admin completo
   - Novos campos: `isAdmin`, `permissoes{}`
   - Permissões: gerenciarAnimais, gerenciarFotos, gerenciarBrindes, gerenciarPosts, visualizarAssinantes, convidarAdmins, gerenciarConfiguracoes

---

### 🛣️ Routes Criadas (6 novas + 1 atualizada)

#### Novas Routes:

1. **foto.routes.js** - `/api/fotos`
   - `GET /` - Listar fotos (query: animalId, limit, skip)
   - `GET /:id` - Buscar foto por ID
   - `POST /batch` - Upload múltiplas fotos (admin) 🔒
   - `PUT /:id` - Atualizar foto (admin) 🔒
   - `DELETE /:id` - Deletar foto (admin) 🔒

2. **brinde.routes.js** - `/api/brindes`
   - `GET /` - Listar brindes (query: disponiveis, limit)
   - `GET /:id` - Buscar brinde por ID
   - `POST /` - Criar brinde (admin) 🔒
   - `PUT /:id` - Atualizar brinde (admin) 🔒
   - `PUT /batch/disponibilidade` - Atualizar disponibilidade em lote (admin) 🔒
   - `DELETE /:id` - Deletar brinde (admin) 🔒

3. **resgate.routes.js** - `/api/resgates`
   - `GET /configuracao` - Buscar configuração
   - `PUT /configuracao` - Atualizar configuração (admin) 🔒
   - `GET /solicitacoes` - Listar solicitações
   - `POST /solicitacoes` - Criar solicitação (usuário autenticado)
   - `PUT /solicitacoes/:id` - Atualizar status (admin) 🔒
   - `DELETE /solicitacoes/:id` - Cancelar solicitação

4. **post.routes.js** - `/api/posts`
   - `GET /` - Listar posts
   - `GET /:id` - Buscar post por ID
   - `POST /` - Criar post (admin) 🔒
   - `PUT /:id` - Atualizar post (admin) 🔒
   - `POST /:id/enviar` - Enviar newsletter (admin) 🔒
   - `GET /track/:token` - Tracking de abertura (pixel invisível)
   - `DELETE /:id` - Deletar post (admin) 🔒

5. **admin.routes.js** - `/api/admin`
   - `GET /check` - Verificar se é admin
   - `GET /convites` - Listar convites (admin) 🔒
   - `POST /convites` - Criar convite (admin) 🔒
   - `GET /convites/verificar/:token` - Verificar convite (público)
   - `POST /convites/aceitar/:token` - Aceitar convite
   - `DELETE /convites/:id` - Cancelar convite (admin) 🔒
   - `GET /lista` - Listar admins (admin) 🔒
   - `PUT /permissoes/:id` - Atualizar permissões (admin) 🔒
   - `DELETE /:id` - Remover admin (admin) 🔒

6. **assinante.routes.js** - `/api/assinantes`
   - `GET /` - Listar assinantes (admin) 🔒
   - `GET /:id` - Buscar assinante por ID (admin) 🔒
   - `GET /stats/geral` - Estatísticas gerais (admin) 🔒
   - `GET /stats/por-dia` - Apoiadores por dia específico (admin) 🔒

#### Route Atualizada:

7. **animal.routes.js** - `/api/animais` ou `/api/animals`
   - Convertida para usar Models Mongoose
   - `GET /` - Listar animais (query: tipo, status, limit, skip)
   - `GET /meses/disponiveis` - Meses com animais
   - `GET /by-month/:mesReferencia` - Animais por mês
   - `GET /:id` - Buscar animal + fotos associadas
   - `POST /` - Criar animal (admin) 🔒
   - `PUT /:id` - Atualizar animal (admin) 🔒
   - `PUT /:id/foto-perfil` - Atualizar foto de perfil (admin) 🔒
   - `DELETE /:id` - Deletar animal (admin) 🔒

---

### 🔒 Middlewares Criados

1. **admin.middleware.js**
   - `isAdmin()` - Verifica se usuário é admin
   - `checkPermission(permissao)` - Verifica permissão específica
   - `PERMISSOES` - Constantes de permissões

2. **upload.middleware.js**
   - Multer configurado para uploads
   - Diretórios: `/uploads/animais`, `/uploads/fotos`, `/uploads/brindes`
   - Validação: apenas imagens (jpeg, jpg, png, gif, webp)
   - Limite: 5MB por arquivo
   - Exports:
     - `uploadSingle` - 1 foto
     - `uploadMultiple` - até 20 fotos
     - `uploadFields` - múltiplos campos

3. **auth.middleware.js** (atualizado)
   - `verifyToken()` - Agora busca User completo com permissões
   - `verifyAdmin()` - Atualizado para usar isAdmin

---

### 📧 Email Service Expandido

**email.service.js** - Novos templates adicionados:

1. `enviarEmailNovasFotos(fotos)` - Notifica sobre novas fotos na galeria
2. `enviarEmailBrindesAtualizados(brindes)` - Notifica apoiadores sobre brindes
3. `enviarEmailSolicitacaoResgate(solicitacao)` - Notifica admin sobre resgate
4. `enviarNewsletter(post, usuarios, emailsPost)` - Envia newsletter com tracking
5. `enviarConviteAdmin(convite, convidadoPor)` - Convite para ser admin

Todos os templates seguem o design padrão com gradiente roxo/azul.

---

### 📊 Estatísticas Disponíveis (API)

**`GET /api/assinantes/stats/geral`** retorna:
- `totalApoiadoresAtivos` - Total com assinatura ativa
- `totalApoiadores` - Total geral (incluindo inativos)
- `apoiadoresCancelados` - Total com assinatura cancelada
- `novosMesAtual` - Novos no mês atual
- `novosPorMes[]` - Novos por mês (últimos 12 meses)
- `novosPorAno[]` - Novos por ano
- `receitaTotal` - Soma de todos pagamentos aprovados

---

### 🔐 Sistema de Permissões

Cada admin pode ter permissões granulares:

```javascript
{
  gerenciarAnimais: boolean,
  gerenciarFotos: boolean,
  gerenciarBrindes: boolean,
  gerenciarPosts: boolean,
  visualizarAssinantes: boolean,
  convidarAdmins: boolean,
  gerenciarConfiguracoes: boolean
}
```

---

### 🚀 Server.js Atualizado

Todas as rotas registradas:
```javascript
app.use('/api/auth', authRoutes);
app.use('/api/animais', animalRoutes);
app.use('/api/fotos', fotoRoutes);
app.use('/api/brindes', brindeRoutes);
app.use('/api/resgates', resgateRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assinantes', assinanteRoutes);
app.use('/api/pagamentos', paymentRoutes);
app.use('/api/user', userRoutes);
```

---

### ✅ Testes de Inicialização

**Status:** ✅ Servidor iniciado com sucesso
- MongoDB Atlas conectado
- Email service configurado
- Todas as rotas carregadas sem erros
- Servidor rodando em: `http://localhost:3000`

---

### 📝 Próximos Passos

Agora que o **Backend está 100% completo**, próxima etapa:

1. ✅ **Backend APIs** - CONCLUÍDO
2. ⏭️ **Angular Services** - PRÓXIMO
3. 🔜 **Admin Components**
4. 🔜 **Route Guards**
5. 🔜 **Features Especiais**

---

### 📌 Notas Importantes

- Todos os models usam Mongoose com ES6 modules
- Middleware de autenticação busca usuário completo do banco
- Upload de arquivos organizado por tipo (animais/fotos/brindes)
- Sistema de tracking de emails com pixel invisível
- Convites admin expiram em 7 dias
- Configuração de resgate é singleton (apenas 1 registro)
- Posts enviados não podem ser editados/deletados
- Fotos podem ter múltiplos animais associados
- Sistema completo de permissões granulares

