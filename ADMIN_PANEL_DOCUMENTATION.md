# 📚 Documentação do Painel Administrativo - Patas Solidárias

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Componentes Principais](#componentes-principais)
4. [Fluxo de Autenticação](#fluxo-de-autenticação)
5. [Sistema de Permissões](#sistema-de-permissões)
6. [Serviços](#serviços)
7. [Guards (Proteção de Rotas)](#guards)
8. [Rotas Administrativas](#rotas-administrativas)
9. [Guia de Manutenção](#guia-de-manutenção)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O Painel Administrativo é a área protegida do sistema onde administradores gerenciam:
- **Animais** para adoção
- **Galeria de fotos**
- **Brindes** e sistema de resgates
- **Newsletter/Posts**
- **Apoiadores** (assinantes)
- **Outros administradores**

### Tecnologias Utilizadas
- **Angular 20.3.6** (Standalone Components)
- **RxJS** para programação reativa
- **HttpClient** para comunicação com API REST
- **JWT** (JSON Web Tokens) para autenticação

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
src/app/
├── components/admin/           # Componentes administrativos
│   ├── admin-layout/          # Layout principal com sidebar
│   ├── dashboard/             # Dashboard com estatísticas
│   ├── animais/               # Gestão de animais
│   ├── fotos/                 # Galeria de fotos
│   ├── brindes/               # Gestão de brindes
│   ├── resgates/              # Solicitações de resgate
│   ├── posts/                 # Newsletter
│   ├── assinantes/            # Apoiadores
│   ├── admins/                # Gestão de admins
│   └── acesso-negado/         # Página de erro 403
├── service/                    # Serviços
│   ├── auth.service.ts        # Autenticação
│   ├── admin.service.ts       # Operações admin
│   └── admin-sidebar.service.ts # Estado da sidebar
├── guards/                     # Proteção de rotas
│   ├── auth.guard.ts          # Verificação de login/admin
│   └── permission.guard.ts    # Verificação de permissões
├── interceptors/               # Interceptadores HTTP
│   └── auth.interceptor.ts    # Adiciona JWT token
└── routes/                     # Definição de rotas
    └── admin.routes.ts        # Rotas administrativas
```

### Fluxo de Dados

```
┌─────────────┐
│   Browser   │
│ (Frontend)  │
└──────┬──────┘
       │ HTTP Requests
       ▼
┌──────────────────┐
│ AuthInterceptor  │ ← Adiciona JWT token
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Backend API    │
│ (localhost:3000) │
└──────────────────┘
```

---

## 🧩 Componentes Principais

### 1. AdminLayoutComponent

**Localização:** `src/app/components/admin/admin-layout/`

**Responsabilidade:**
- Container principal do painel administrativo
- Gerencia a sidebar com navegação
- Controla estado de abertura/fechamento da sidebar
- Gerencia permissões do usuário atual
- Responsivo (mobile/desktop)

**Propriedades Importantes:**
```typescript
currentUser: any            // Usuário logado
isSidebarOpen: boolean      // Estado da sidebar
permissoes: AdminPermissoes // Permissões do admin
```

**Métodos Principais:**
- `toggleSidebar()`: Abre/fecha a sidebar
- `logout()`: Faz logout do usuário
- `navigateTo(route)`: Navega para rota e fecha sidebar em mobile
- `temPermissao(permissao)`: Verifica se tem permissão específica

**Comportamento Responsivo:**
- **Desktop (≥768px)**: Sidebar aberta por padrão
- **Mobile (<768px)**: Sidebar fechada, abre como overlay

---

### 2. DashboardComponent

**Localização:** `src/app/components/admin/dashboard/`

**Responsabilidade:**
- Exibe estatísticas gerais do sistema
- Cards com métricas (total de apoiadores, arrecadação, etc.)
- Ações rápidas baseadas em permissões
- Gráficos visuais (via ChartComponent)

**Funcionamento:**
1. `ngOnInit()`: Verifica permissões do usuário
2. Carrega estatísticas de forma assíncrona (não bloqueia UI)
3. Exibe cards e ações conforme permissões

**Otimizações:**
- Verificação de permissão **síncrona** (via `currentUser.role`)
- Carregamento de estatísticas em `setTimeout(0)` (não-bloqueante)
- Fallback para backend se verificação local falhar

**Estatísticas Exibidas:**
- Total de Apoiadores
- Apoiadores Ativos
- Total Arrecadado (BRL)
- Média por Apoiador

---

### 3. Lista de Componentes por Funcionalidade

#### 🐾 Animais
- **ListaAnimaisComponent**: Lista todos os animais cadastrados
- **FormAnimalComponent**: Cadastro/edição de animais

#### 📸 Fotos
- **ListaFotosComponent**: Galeria de fotos
- **UploadFotosComponent**: Upload de novas fotos
- **FotosPendentesComponent**: Fotos aguardando aprovação

#### 🎁 Brindes
- **ListaBrindesComponent**: Lista de brindes disponíveis
- **FormBrindeComponent**: Cadastro/edição de brindes
- **SelecionarBrindesComponent**: Seleção de brindes para resgate

#### 📦 Resgates
- **ListaResgatesComponent**: Solicitações de resgate
- **ConfigResgateComponent**: Configuração de horários

#### 📧 Posts/Newsletter
- **ListaPostsComponent**: Lista de newsletters
- **EditorPostComponent**: Editor de newsletter

#### 👥 Assinantes
- **ListaAssinantesComponent**: Lista de apoiadores
- **DetalheAssinanteComponent**: Detalhes de um apoiador
- **EstatisticasComponent**: Estatísticas de assinantes

#### 👤 Administradores
- **ListaAdminsComponent**: Lista de administradores
- **ListaConvitesComponent**: Convites pendentes
- **AceitarConviteComponent**: Página de aceitação de convite

---

## 🔐 Fluxo de Autenticação

### 1. Login do Usuário

```typescript
// LoginComponent
onSubmit() {
  authService.login(credentials).subscribe({
    next: (response) => {
      // 1. Backend retorna: { token, user }
      // 2. AuthService armazena no localStorage
      // 3. Atualiza BehaviorSubject currentUser
      // 4. Aguarda 50ms (garante sincronização)
      // 5. Navega baseado no role do usuário
      
      if (user.role === 'admin') {
        router.navigate(['/admin']);
      } else if (user.isDoador) {
        router.navigate(['/conta']);
      }
    }
  });
}
```

### 2. Armazenamento do Token

```typescript
// AuthService
login() {
  return http.post('/api/auth/login', credentials).pipe(
    tap(response => {
      if (response.token && response.user) {
        // Armazena no localStorage (persistência)
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Atualiza Observable (estado reativo)
        this.currentUserSubject.next(response.user);
      }
    })
  );
}
```

### 3. Interceptação de Requisições HTTP

```typescript
// AuthInterceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = authService.getToken(); // Recupera do localStorage
  
  if (token) {
    // Clone a requisição e adiciona header Authorization
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req); // Sem token, envia requisição normal
};
```

### 4. Proteção de Rotas

```typescript
// AdminGuard
export const adminGuard: CanActivateFn = (route, state) => {
  // 1. Verifica se está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  
  // 2. Verifica se é admin
  if (authService.isAdmin()) {
    return true;
  }
  
  // 3. Redireciona se não for admin
  router.navigate(['/']);
  return false;
};
```

---

## 🔑 Sistema de Permissões

### Interface AdminPermissoes

```typescript
interface AdminPermissoes {
  gerenciarAnimais: boolean;        // CRUD de animais
  gerenciarFotos: boolean;          // Upload e moderação de fotos
  gerenciarBrindes: boolean;        // CRUD de brindes e resgates
  gerenciarPosts: boolean;          // CRUD de newsletter
  visualizarAssinantes: boolean;    // Ver dados de apoiadores
  convidarAdmins: boolean;          // Convidar novos admins
  gerenciarConfiguracoes: boolean;  // Configurações do sistema
}
```

### Verificação de Permissões

#### Método 1: No Template (Recomendado)

```html
<!-- Exibe link apenas se tiver permissão -->
@if (temPermissao('gerenciarAnimais')) {
  <a routerLink="/admin/animais">Gerenciar Animais</a>
}
```

#### Método 2: No Component

```typescript
// DashboardComponent
get acoesRapidas() {
  const acoes = [];
  
  if (this.permissoes.gerenciarAnimais) {
    acoes.push({
      titulo: 'Gerenciar Animais',
      link: '/admin/animais'
    });
  }
  
  return acoes;
}
```

#### Método 3: Via Guard (Rotas)

```typescript
// admin.routes.ts
{
  path: 'animais',
  canActivate: [permissionGuard],
  data: { permission: 'gerenciarAnimais' }, // ← Define permissão necessária
  component: ListaAnimaisComponent
}
```

### Fallback de Permissões

Se a chamada ao backend `/api/admin/check` falhar (401, 500, etc.), o sistema usa fallback local:

```typescript
// AdminLayoutComponent
if (currentUser && currentUser.role === 'admin') {
  // Define permissões completas localmente
  this.permissoes = {
    gerenciarAnimais: true,
    gerenciarFotos: true,
    gerenciarBrindes: true,
    gerenciarPosts: true,
    visualizarAssinantes: true,
    convidarAdmins: true,
    gerenciarConfiguracoes: true
  };
}
```

---

## 🛠️ Serviços

### AuthService

**Localização:** `src/app/service/auth.service.ts`

**Responsabilidades:**
- Gerenciar autenticação (login, logout, registro)
- Armazenar/recuperar JWT token
- Manter estado do usuário logado (BehaviorSubject)
- Verificar se usuário é admin/doador

**Métodos Principais:**

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `login(credentials)` | `Observable<{token, user}>` | Autentica usuário |
| `logout()` | `void` | Remove token e limpa estado |
| `register(userData)` | `Observable<{message}>` | Registra novo usuário |
| `getToken()` | `string \| null` | Retorna JWT do localStorage |
| `isAuthenticated()` | `boolean` | Verifica se está logado |
| `isAdmin()` | `boolean` | Verifica se é admin |
| `isDoador()` | `boolean` | Verifica se é doador |
| `currentUserValue` | `User \| null` | Getter do usuário atual |

**Observables:**
```typescript
currentUser: Observable<User | null> // Stream do usuário logado
```

---

### AdminService

**Localização:** `src/app/service/admin.service.ts`

**Responsabilidades:**
- Verificar status de admin no backend
- Gerenciar permissões de administradores
- CRUD de convites admin
- Gerenciar lista de administradores

**Métodos Principais:**

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `verificarAdmin()` | `Observable<{isAdmin, permissoes}>` | Verifica se é admin |
| `temPermissao(permissao)` | `boolean` | Verifica permissão específica |
| `listarConvites(status?)` | `Observable<{convites}>` | Lista convites |
| `criarConvite(email, permissoes)` | `Observable<{convite}>` | Cria novo convite |
| `verificarConvite(token)` | `Observable<{convite}>` | Verifica validade |
| `aceitarConvite(token)` | `Observable<{permissoes}>` | Aceita convite |
| `cancelarConvite(id)` | `Observable<{message}>` | Cancela convite |
| `listarAdmins()` | `Observable<{admins}>` | Lista admins |
| `atualizarPermissoes(id, permissoes)` | `Observable<{admin}>` | Atualiza permissões |
| `removerAdmin(id)` | `Observable<{message}>` | Remove admin |

**Observables:**
```typescript
isAdmin$: Observable<boolean>               // Stream de status admin
permissoes$: Observable<AdminPermissoes>    // Stream de permissões
```

---

### AdminSidebarService

**Localização:** `src/app/service/admin-sidebar.service.ts`

**Responsabilidades:**
- Controlar estado (aberto/fechado) da sidebar
- Sincronizar estado entre componentes
- Comportamento responsivo (desktop/mobile)

**Métodos:**

| Método | Descrição |
|--------|-----------|
| `toggle()` | Alterna estado aberto/fechado |
| `open()` | Abre a sidebar |
| `close()` | Fecha a sidebar |
| `isOpen()` | Retorna estado atual (boolean) |

**Observables:**
```typescript
sidebarOpen$: Observable<boolean> // Stream do estado da sidebar
```

**Estado Inicial:**
- Desktop (≥768px): `true` (aberta)
- Mobile (<768px): `false` (fechada)

---

## 🛡️ Guards

### adminGuard

**Localização:** `src/app/guards/auth.guard.ts`

**Função:** Protege rotas administrativas, permitindo acesso apenas para usuários com `role === 'admin'`

**Fluxo:**
1. Verifica se está autenticado → Senão, redireciona para `/login`
2. Verifica se é admin → Senão, redireciona para `/` (home)
3. Se ambos OK, permite acesso

**Uso:**
```typescript
{
  path: 'admin',
  canActivate: [adminGuard], // ← Protege toda área admin
  children: [...]
}
```

---

### permissionGuard

**Localização:** `src/app/guards/permission.guard.ts`

**Função:** Verifica permissões específicas do administrador

**Fluxo:**
1. Lê permissão necessária da configuração da rota (`data.permission`)
2. Chama `/api/admin/check` no backend
3. Verifica se admin tem a permissão específica
4. Se não tiver, redireciona para `/admin` com erro

**Uso:**
```typescript
{
  path: 'animais',
  canActivate: [permissionGuard],
  data: { permission: 'gerenciarAnimais' }, // ← Define permissão
  component: ListaAnimaisComponent
}
```

**Mensagens de Erro:**
- `admin-required`: Usuário não é admin
- `permission-denied`: Admin sem permissão específica
- `auth-failed`: Erro na verificação (backend offline, etc.)

---

### authGuard

**Localização:** `src/app/guards/auth.guard.ts`

**Função:** Verifica apenas se usuário está autenticado (não verifica admin)

**Uso:**
```typescript
{
  path: 'conta',
  canActivate: [authGuard], // ← Apenas logado
  component: ContaComponent
}
```

---

### doadorGuard

**Localização:** `src/app/guards/auth.guard.ts`

**Função:** Verifica se usuário é doador ativo

**Uso:**
```typescript
{
  path: 'beneficios',
  canActivate: [doadorGuard], // ← Apenas doadores
  component: BeneficiosComponent
}
```

---

## 🗺️ Rotas Administrativas

### Estrutura de Rotas

```
/admin
  ├── /dashboard              [Dashboard principal]
  ├── /animais
  │   ├── /                   [Lista de animais]
  │   ├── /novo               [Cadastrar animal]
  │   └── /editar/:id         [Editar animal]
  ├── /fotos
  │   ├── /                   [Galeria]
  │   ├── /upload             [Upload de fotos]
  │   └── /pendentes          [Moderação]
  ├── /brindes
  │   ├── /                   [Lista de brindes]
  │   ├── /novo               [Cadastrar brinde]
  │   ├── /editar/:id         [Editar brinde]
  │   └── /selecionar         [Selecionar para resgate]
  ├── /resgates
  │   ├── /                   [Solicitações]
  │   └── /configuracao       [Horários de resgate]
  ├── /posts
  │   ├── /                   [Lista newsletters]
  │   ├── /novo               [Nova newsletter]
  │   └── /editar/:id         [Editar newsletter]
  ├── /assinantes
  │   ├── /                   [Lista apoiadores]
  │   ├── /estatisticas       [Estatísticas]
  │   └── /:id                [Detalhes do apoiador]
  ├── /admins
  │   ├── /                   [Lista admins]
  │   └── /convites           [Convites pendentes]
  ├── /aceitar-convite/:token [Aceitar convite]
  └── /acesso-negado          [Erro 403]
```

### Mapeamento Permissão → Rota

| Permissão | Rotas Protegidas |
|-----------|------------------|
| `gerenciarAnimais` | `/admin/animais/*` |
| `gerenciarFotos` | `/admin/fotos/*` |
| `gerenciarBrindes` | `/admin/brindes/*`, `/admin/resgates/*` |
| `gerenciarPosts` | `/admin/posts/*` |
| `visualizarAssinantes` | `/admin/assinantes/*` |
| `convidarAdmins` | `/admin/admins/*` |
| `gerenciarConfiguracoes` | `/admin/resgates/configuracao` |

---

## 🔧 Guia de Manutenção

### Como Adicionar uma Nova Funcionalidade Admin

#### 1. Criar o Component

```bash
ng generate component components/admin/nova-feature/lista-feature --standalone
```

#### 2. Adicionar Rota em `admin.routes.ts`

```typescript
{
  path: 'nova-feature',
  canActivate: [permissionGuard],
  data: { permission: 'gerenciarNovaFeature' }, // Nova permissão
  loadComponent: () => import('./components/admin/nova-feature/lista-feature.component')
    .then(m => m.ListaFeatureComponent),
  title: 'Gerenciar Nova Feature - Admin'
}
```

#### 3. Atualizar Interface de Permissões

```typescript
// model/admin.model.ts
export interface AdminPermissoes {
  gerenciarAnimais: boolean;
  // ... permissões existentes
  gerenciarNovaFeature: boolean; // ← Adicionar nova permissão
}
```

#### 4. Adicionar Link na Sidebar

```html
<!-- admin-layout.component.html -->
@if (temPermissao('gerenciarNovaFeature')) {
  <a routerLink="/admin/nova-feature" routerLinkActive="active" class="nav-item">
    <span class="icon"><i class="fas fa-icon"></i></span>
    <span class="label">Nova Feature</span>
  </a>
}
```

#### 5. Criar Service (se necessário)

```bash
ng generate service service/nova-feature --skip-tests
```

---

### Como Adicionar uma Nova Permissão

#### Backend (Node.js/Express)

```javascript
// models/User.js
const userSchema = new Schema({
  // ... campos existentes
  permissoes: {
    gerenciarAnimais: { type: Boolean, default: false },
    gerenciarNovaFeature: { type: Boolean, default: false } // ← Adicionar
  }
});
```

#### Frontend (Angular)

1. Atualizar `AdminPermissoes` interface
2. Atualizar fallback em `admin-layout.component.ts`
3. Adicionar guard em rotas necessárias
4. Atualizar template da sidebar

---

### Como Debugar Problemas de Autenticação

#### 1. Token não está sendo enviado

**Verificar:**
```typescript
// Abrir DevTools → Application → Local Storage
// Verificar se existe:
// - key: 'token' → value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'
// - key: 'currentUser' → value: '{"_id":"...","role":"admin",...}'
```

**Se não existir:**
- Verificar se login está salvando: `auth.service.ts` → `tap()` do `login()`
- Verificar se `isBrowser` é true (SSR issue)

#### 2. Backend retorna 401 (Unauthorized)

**Verificar:**
```typescript
// DevTools → Network → Selecionar request com 401
// Headers → Request Headers
// Verificar se existe: Authorization: Bearer <token>
```

**Se não existir:**
- Verificar `auth.interceptor.ts` está configurado em `app.config.ts`
- Verificar `getToken()` retorna token válido

#### 3. Guards bloqueando acesso indevidamente

**Verificar:**
```typescript
// Console do navegador
console.log('isAuthenticated:', authService.isAuthenticated());
console.log('isAdmin:', authService.isAdmin());
console.log('currentUser:', authService.currentUserValue);
console.log('role:', authService.currentUserValue?.role);
```

**Se `role` não é 'admin':**
- Verificar banco de dados: campo `role` do usuário
- Re-fazer login para atualizar localStorage

---

### Como Atualizar Dependências

```bash
# Verificar versões atuais
ng version

# Atualizar Angular CLI
npm install -g @angular/cli@latest

# Atualizar dependências do projeto
ng update @angular/core @angular/cli

# Atualizar RxJS (se necessário)
ng update rxjs
```

---

## 🐛 Troubleshooting

### Problema: "Sidebar não aparece"

**Causa:** Estado inicial incorreto

**Solução:**
```typescript
// admin-sidebar.service.ts
private getInitialState(): boolean {
  return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
}

// admin-layout.component.ts
ngOnInit() {
  if (window.innerWidth >= 768) {
    this.adminSidebarService.open(); // ← Força abertura em desktop
  }
}
```

---

### Problema: "Dashboard carrega muito devagar"

**Causa:** Verificação de permissões bloqueando UI

**Solução:**
```typescript
// dashboard.component.ts
verificarPermissoes(): void {
  const currentUser = this.authService.currentUserValue;
  
  if (currentUser && currentUser.role === 'admin') {
    // Verificação SÍNCRONA (não espera backend)
    this.permissoes = { /* permissões completas */ };
    this.carregando = false;
  } else {
    // Fallback assíncrono
    this.adminService.verificarAdmin().subscribe(...);
  }
}
```

---

### Problema: "Links redirecionam para home ao invés da página correta"

**Causa:** Rotas usando `/adm/` ao invés de `/admin/`

**Solução:** Buscar e substituir em todo projeto:
```bash
# PowerShell
Get-ChildItem -Recurse -Include *.ts,*.html | 
  Select-String "/adm/" | 
  ForEach-Object { $_.Path }
```

Substituir `'/adm/'` por `'/admin/'`

---

### Problema: "401 Unauthorized em todas as requisições"

**Causa:** Token não está sendo incluído no header

**Diagnóstico:**
1. Verificar `localStorage.getItem('token')` retorna valor
2. Verificar `authInterceptor` está registrado em `app.config.ts`
3. Verificar timing: login → localStorage → navegação

**Solução:**
```typescript
// login.component.ts
this.authService.login(credentials).subscribe({
  next: (response) => {
    // Aguardar 50ms para garantir que localStorage foi atualizado
    setTimeout(() => {
      this.router.navigate(['/admin']);
    }, 50);
  }
});
```

---

### Problema: "Permissões não carregam"

**Causa:** Backend `/api/admin/check` retornando 401/500

**Solução:** Implementar fallback local
```typescript
// admin-layout.component.ts
this.adminService.verificarAdmin().subscribe({
  error: (err) => {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role === 'admin') {
      // Usar permissões padrão localmente
      this.permissoes = { /* todas true */ };
    }
  }
});
```

---

## 📝 Checklist de Deploy

### Antes de fazer Deploy em Produção:

- [ ] Remover **todos** `console.log()` de debug
- [ ] Atualizar `environment.production.ts` com URLs corretas
- [ ] Verificar se todos os guards estão configurados
- [ ] Testar fluxo completo: login → dashboard → cada página
- [ ] Verificar responsividade (mobile/tablet/desktop)
- [ ] Testar com diferentes permissões de admin
- [ ] Verificar se todos os links usam `/admin/` (não `/adm/`)
- [ ] Build de produção sem erros: `ng build --configuration production`
- [ ] Testar build em servidor local antes de deploy

---

## 🔒 Boas Práticas de Segurança

### 1. Nunca armazene senhas em claro
```typescript
// ❌ ERRADO
user.senha = 'senha123';

// ✅ CORRETO (backend deve fazer hash)
// Frontend apenas envia, backend usa bcrypt
```

### 2. Sempre validar no backend
```typescript
// Guards no frontend são para UX, não segurança
// Backend SEMPRE deve verificar:
// - Token JWT válido
// - Usuário tem permissão
// - Dados pertencem ao usuário
```

### 3. Tokens com expiração
```javascript
// Backend: JWT com expiração de 24h
jwt.sign(payload, secret, { expiresIn: '24h' });
```

### 4. HTTPS em produção
```typescript
// environment.production.ts
export const environment = {
  apiUrl: 'https://api.patassolidarias.com.br', // ← HTTPS!
  production: true
};
```

---

## 📊 Métricas de Performance

### Tempo de Carregamento Esperado:
- **Login → Dashboard**: < 2 segundos
- **Navegação entre páginas**: < 500ms
- **Carregamento de listas**: < 1 segundo
- **Upload de foto**: Depende da internet

### Otimizações Implementadas:
- ✅ Lazy loading de rotas (`loadComponent`)
- ✅ Verificação de permissões síncrona (não espera backend)
- ✅ Carregamento de estatísticas não-bloqueante (`setTimeout`)
- ✅ Sidebar com transições CSS (sem JavaScript)
- ✅ Standalone components (bundle menor)

---

## 📞 Suporte e Manutenção

### Para reportar bugs:
1. Abrir issue no GitHub com:
   - Descrição do problema
   - Passos para reproduzir
   - Logs do console (F12 → Console)
   - Screenshot (se aplicável)

### Para solicitar novas features:
1. Abrir issue com label "enhancement"
2. Descrever caso de uso
3. Especificar permissão necessária

### Para dúvidas técnicas:
- Consultar esta documentação primeiro
- Verificar seção [Troubleshooting](#troubleshooting)
- Abrir issue com label "question"

---

## 📜 Histórico de Mudanças

### v1.3.0 (Outubro 2025)
- ✅ Corrigido bug de rotas `/adm/` → `/admin/`
- ✅ Removido excesso de logs de debug
- ✅ Otimizado carregamento do dashboard (verificação síncrona)
- ✅ Sidebar abre automaticamente em desktop
- ✅ Adicionado fallback de permissões se backend falhar

### v1.2.0
- ✅ Sistema de permissões granulares
- ✅ Guards de permissão por rota
- ✅ Sistema de convites para admins

### v1.1.0
- ✅ Dashboard com estatísticas
- ✅ Gráficos visuais (ChartComponent)
- ✅ Sistema de resgates de brindes

### v1.0.0
- ✅ Lançamento inicial
- ✅ Autenticação JWT
- ✅ CRUD de animais, fotos, brindes
- ✅ Newsletter

---

## 🎓 Glossário

| Termo | Significado |
|-------|-------------|
| **JWT** | JSON Web Token - Token de autenticação criptografado |
| **Guard** | Função que protege rotas no Angular (CanActivateFn) |
| **Interceptor** | Função que intercepta requisições HTTP |
| **BehaviorSubject** | Observable que mantém último valor e emite para novos subscribers |
| **Standalone Component** | Component sem NgModule (Angular 14+) |
| **Lazy Loading** | Carregamento sob demanda (não no bundle inicial) |
| **SSR** | Server-Side Rendering - Renderização no servidor |
| **Observable** | Stream de dados assíncrono (RxJS) |
| **Pipe (RxJS)** | Operador para transformar Observables |

---

**Última atualização:** Outubro 2025  
**Versão do Angular:** 20.3.6  
**Mantenedor:** Equipe Patas Solidárias
