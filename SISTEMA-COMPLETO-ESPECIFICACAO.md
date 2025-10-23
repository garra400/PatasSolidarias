# Sistema Patas Solidárias - Especificação Técnica Completa

## Visão Geral
Sistema de gerenciamento completo para ONGs de animais com área administrativa separada, gestão de galeria de fotos, brindes, posts/newsletter e sistema de resgate.

---

## 1. Sistema de Galeria de Fotos

### Funcionalidades
- ✅ Admin adiciona múltiplas fotos em batch
- ✅ Cada foto pode ser associada a um ou mais animais
- ✅ Campo de descrição para cada foto
- ✅ Envio de email em lote opcional (após adicionar todas as fotos)
- ✅ Flag `emailEnviado` para controle de notificações

### Models
- `Foto` (animal.model.ts)
- `FotoUploadBatch` (animal.model.ts)

### Fluxo
1. Admin seleciona múltiplas fotos
2. Para cada foto: adiciona descrição e seleciona animais
3. Opção de enviar email após upload de todas
4. Sistema salva fotos e envia email se solicitado

---

## 2. Sistema de Gerenciamento de Animais

### Funcionalidades
- ✅ CRUD completo (criar, ler, atualizar, deletar)
- ✅ Campos: nome, tipo, descrição, foto de perfil
- ✅ Foto de perfil é uma das fotos associadas ao animal
- ✅ Admin pode trocar foto de perfil selecionando de fotos existentes
- ✅ Foto de perfil aparece na galeria do animal
- ✅ Animais exibidos na home vêm do banco de dados

### Models
- `Animal` (animal.model.ts) - atualizado com campos novos

### Fluxo de Troca de Foto de Perfil
1. Admin acessa edição do animal
2. Visualiza todas as fotos associadas ao animal
3. Seleciona uma foto como perfil
4. Sistema atualiza `fotoPerfilId`

---

## 3. Sistema de Gerenciamento de Brindes

### Funcionalidades
- ✅ CRUD de brindes (nome, descrição, foto)
- ✅ Flag `disponivelParaResgate` para ativar/desativar
- ✅ Campo `ordem` para controlar exibição
- ✅ Máximo 4 brindes na home
- ✅ Email automático quando brindes são atualizados
- ✅ Texto dinâmico na home: "stickers" ou "rewards"

### Models
- `Brinde` (brinde.model.ts)

### Lógica de Exibição Home
```typescript
// Se todos brindes são stickers
texto = "Confira os stickers exclusivos dos nossos pets"
// Se há outros tipos de brindes
texto = "Confira as recompensas exclusivas dos nossos pets"
```

### Email de Notificação
- Enviado apenas para apoiadores
- Inclui fotos dos brindes disponíveis
- Link para página de resgate

---

## 4. Sistema de Resgate de Brindes

### Funcionalidades
- ✅ Admin configura dias da semana disponíveis
- ✅ Admin configura horários (início, fim, intervalo)
- ✅ Usuário seleciona brinde e horário
- ✅ Email enviado ao admin com detalhes
- ✅ Status do resgate (pendente, confirmado, retirado)

### Models
- `ConfiguracaoResgate` (brinde.model.ts)
- `HorarioResgate` (brinde.model.ts)
- `SolicitacaoResgate` (brinde.model.ts)

### Fluxo
1. Usuário acessa página de brindes
2. Seleciona brinde desejado
3. Escolhe data/horário disponível
4. Confirma solicitação
5. Email enviado ao admin
6. Admin confirma e atualiza status

---

## 5. Dashboard Admin - Assinantes

### Funcionalidades
- ✅ Lista de todos assinantes
- ✅ Informações: nome, email, data início, status
- ✅ Aba de gerenciamento de assinaturas
- ✅ Estatísticas por mês, ano, dia

### Models
- `EstatisticasApoiadores` (admin.model.ts)
- `InfoAssinante` (admin.model.ts)

### Métricas
- Total apoiadores ativos/inativos
- Novos apoiadores por período
- Valor total arrecadado
- Média de tempo de contribuição

---

## 6. Sistema de Posts/Newsletter

### Funcionalidades
- ✅ Editor rico de conteúdo (HTML)
- ✅ Templates customizáveis
- ✅ Inserção de imagens de animais
- ✅ Inserção de imagens de brindes
- ✅ Seleção de destinatários (todos ou apoiadores)
- ✅ Preview antes de enviar
- ✅ Rastreamento de abertura de emails

### Models
- `Post` (post.model.ts)
- `TemplatePost` (post.model.ts)
- `EmailPost` (post.model.ts)

### Fluxo
1. Admin cria post usando template
2. Customiza conteúdo, adiciona imagens
3. Visualiza preview
4. Seleciona destinatários
5. Envia ou salva como rascunho
6. Sistema envia emails e registra status

---

## 7. Sistema de Convites Admin

### Funcionalidades
- ✅ Convite apenas para usuários já registrados
- ✅ Email com link de confirmação
- ✅ Token único com expiração
- ✅ Admin pode ser também apoiador
- ✅ Sistema de permissões granulares

### Models
- `ConviteAdmin` (admin.model.ts)
- `UserAdmin` (admin.model.ts)
- `AdminPermissoes` (admin.model.ts)

### Fluxo
1. Admin acessa gestão de convites
2. Busca usuário registrado por email
3. Envia convite
4. Usuário recebe email com link
5. Clica no link de confirmação
6. Sistema ativa flag `isAdmin`
7. Admin pode definir permissões específicas

---

## 8. Área Admin Separada (/adm)

### Funcionalidades
- ✅ Rota separada: `/adm`
- ✅ Login específico para admin
- ✅ Dashboard com todas funcionalidades
- ✅ Guards para proteger rotas
- ✅ Menu lateral com navegação

### Estrutura de Rotas
```
/adm
  /login
  /dashboard
  /animais
    /lista
    /novo
    /editar/:id
  /fotos
    /upload
    /galeria
  /brindes
    /lista
    /novo
    /editar/:id
    /configurar-resgate
  /assinantes
    /lista
    /estatisticas
  /posts
    /lista
    /novo
    /editar/:id
  /configuracoes
  /convites
```

### Guards
- `AdminGuard` - Verifica se usuário é admin
- `PermissionGuard` - Verifica permissões específicas

---

## Estrutura de Arquivos Criados/Atualizados

### Models
- ✅ `src/app/model/animal.model.ts` - Animal, Foto, FotoUploadBatch
- ✅ `src/app/model/brinde.model.ts` - Brinde, ConfiguracaoResgate, SolicitacaoResgate
- ✅ `src/app/model/post.model.ts` - Post, TemplatePost, EmailPost
- ✅ `src/app/model/admin.model.ts` - ConviteAdmin, EstatisticasApoiadores, UserAdmin

### Componentes a Criar
- `admin/dashboard`
- `admin/animais/lista-animais`
- `admin/animais/form-animal`
- `admin/fotos/upload-fotos`
- `admin/fotos/galeria-fotos`
- `admin/brindes/lista-brindes`
- `admin/brindes/form-brinde`
- `admin/brindes/config-resgate`
- `admin/assinantes/lista-assinantes`
- `admin/assinantes/estatisticas`
- `admin/posts/lista-posts`
- `admin/posts/editor-post`
- `admin/convites/gerenciar-convites`

### Serviços a Criar
- `AnimalService` - CRUD animais
- `FotoService` - Upload e gerenciamento fotos
- `BrindeService` - CRUD brindes e configuração resgate
- `PostService` - CRUD posts e envio emails
- `AdminService` - Gestão convites e permissões
- `AssinanteService` - Listagem e estatísticas
- `EmailService` - Envio de emails (fotos, brindes, posts)

---

## Próximos Passos

1. ✅ Models criados
2. ⏳ Criar serviços Angular
3. ⏳ Criar componentes admin
4. ⏳ Implementar rotas e guards
5. ⏳ Desenvolver APIs backend
6. ⏳ Implementar sistema de emails
7. ⏳ Testes e validações

---

## Tecnologias

### Frontend
- Angular 18+
- TypeScript
- SCSS
- Componentes standalone
- Control flow (@if/@for)

### Backend (a definir)
- Node.js + Express
- MongoDB / PostgreSQL
- Sistema de emails (Nodemailer)
- Upload de imagens (Multer/Cloudinary)
- Autenticação JWT

### Features Especiais
- Editor rico (TinyMCE/Quill)
- Calendário/agendamento (FullCalendar)
- Gráficos (Chart.js/ApexCharts)
- Upload de imagens (drag and drop)

---

**Data de Criação:** 23 de Outubro de 2025  
**Versão:** 1.0  
**Status:** Modelos criados, pronto para implementação
