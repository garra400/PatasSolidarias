# Route Guards & Admin Routing - Sistema Admin Completo

## ✅ Status: CONCLUÍDO

### 🛡️ Guards Criados

#### 1. **admin.guard.ts** (Novo)
Guard específico para verificação admin com integração ao AdminService.

**Funcionalidades:**
- Verifica autenticação via AdminService
- Chama `verificarAdmin()` do backend
- Redireciona para `/login` se não autenticado
- Redireciona para `/login` com `returnUrl` e erro
- Logs de acesso negado

**Uso:**
```typescript
{
  path: 'admin',
  canActivate: [adminGuard],
  children: [...]
}
```

---

#### 2. **permission.guard.ts** (Novo)
Guard para verificação de permissões granulares.

**Funcionalidades:**
- Verifica permissão específica do usuário
- Suporta configuração via `route.data['permission']`
- Helper function `createPermissionGuard(permission)`
- Redireciona para `/login` se não autenticado
- Redireciona para `/adm` com erro se sem permissão
- Logs detalhados de acesso

**Uso Método 1 - Via data:**
```typescript
{
  path: 'animais',
  canActivate: [permissionGuard],
  data: { permission: 'gerenciarAnimais' }
}
```

**Uso Método 2 - Helper function:**
```typescript
{
  path: 'fotos',
  canActivate: [createPermissionGuard('gerenciarFotos')]
}
```

---

#### 3. **auth.guard.ts** (Atualizado)
Guards existentes melhorados.

**Guards disponíveis:**
- `authGuard` - Verifica autenticação básica
- `adminGuard` - Verifica admin com melhor tratamento de erros
- `doadorGuard` - Verifica se é apoiador

**Melhorias:**
- AdminGuard agora usa `state.url` para returnUrl
- Query params com tipo de erro
- Logs de acesso negado
- Verificação em camadas (auth → admin)

---

### 🗺️ Estrutura de Rotas Admin

#### **admin.routes.ts**
Arquivo completo de configuração de rotas administrativas.

**Estrutura:**
```
/adm
├── /dashboard (requer admin)
├── /animais (requer gerenciarAnimais)
│   ├── / (lista)
│   ├── /novo
│   └── /editar/:id
├── /fotos (requer gerenciarFotos)
│   ├── / (galeria)
│   └── /upload
├── /brindes (requer gerenciarBrindes)
│   ├── / (lista)
│   ├── /novo
│   └── /editar/:id
├── /resgates (requer gerenciarBrindes)
│   ├── / (solicitações)
│   └── /configuracao (requer gerenciarConfiguracoes)
├── /posts (requer gerenciarPosts)
│   ├── / (lista)
│   ├── /novo
│   └── /editar/:id
├── /assinantes (requer visualizarAssinantes)
│   ├── / (lista)
│   ├── /estatisticas
│   └── /:id (detalhes)
├── /admins (requer convidarAdmins)
│   ├── / (lista)
│   └── /convites
├── /aceitar-convite/:token (apenas admin logado)
└── /acesso-negado
```

**Características:**
- ✅ Lazy loading em todos os componentes
- ✅ Guards aplicados em cada rota
- ✅ Permissões granulares
- ✅ Títulos de página configurados
- ✅ Hierarquia clara com children
- ✅ Redirecionamento padrão para dashboard

---

### 📦 Barrel Export (index.ts)

Arquivo criado para facilitar imports:

```typescript
export { 
  authGuard, 
  adminGuard, 
  doadorGuard 
} from './auth.guard';

export { 
  permissionGuard, 
  createPermissionGuard 
} from './permission.guard';

export { 
  adminGuardNew 
} from './admin.guard';
```

**Uso:**
```typescript
import { adminGuard, permissionGuard } from '../guards';
```

---

### 🔒 Matriz de Permissões

| Permissão | Rotas Protegidas |
|-----------|------------------|
| `gerenciarAnimais` | /adm/animais/** |
| `gerenciarFotos` | /adm/fotos/** |
| `gerenciarBrindes` | /adm/brindes/**, /adm/resgates/** |
| `gerenciarPosts` | /adm/posts/** |
| `visualizarAssinantes` | /adm/assinantes/** |
| `convidarAdmins` | /adm/admins/** |
| `gerenciarConfiguracoes` | /adm/resgates/configuracao |

---

### 🚀 Fluxo de Proteção

#### Cenário 1: Usuário não autenticado
```
Tenta acessar /adm/animais
→ adminGuard verifica autenticação
→ Redireciona para /login?returnUrl=/adm/animais
```

#### Cenário 2: Usuário autenticado, mas não admin
```
Tenta acessar /adm/dashboard
→ adminGuard verifica isAdmin
→ Redireciona para /?error=admin-required
```

#### Cenário 3: Admin sem permissão específica
```
Admin tenta acessar /adm/admins (requer convidarAdmins)
→ permissionGuard verifica convidarAdmins = false
→ Redireciona para /adm?error=permission-denied&required=convidarAdmins
```

#### Cenário 4: Admin com permissão
```
Admin com gerenciarAnimais acessa /adm/animais
→ adminGuard: OK ✅
→ permissionGuard: gerenciarAnimais = true ✅
→ Permite acesso
```

---

### 🎯 Integração com app.routes.ts

Para ativar as rotas admin no projeto, adicionar em `app.routes.ts`:

```typescript
import { adminRoutes } from './routes/admin.routes';

export const routes: Routes = [
  // ... rotas existentes
  {
    path: 'adm',
    children: adminRoutes
  }
];
```

---

### 📝 Próximos Passos

1. ✅ **Backend APIs** - CONCLUÍDO
2. ✅ **Angular Services** - CONCLUÍDO  
3. ✅ **Route Guards** - CONCLUÍDO
4. ✅ **Admin Routing** - CONCLUÍDO
5. ⏭️ **Admin Components** - PRÓXIMO (20 componentes a criar)
6. 🔜 **Features Especiais**

---

### 🏗️ Componentes a Criar

Lista de componentes referenciados nas rotas (ainda não existem):

**Dashboard (1):**
- DashboardComponent

**Animais (2):**
- ListaAnimaisComponent
- FormAnimalComponent

**Fotos (2):**
- ListaFotosComponent
- UploadFotosComponent

**Brindes (2):**
- ListaBrindesComponent
- FormBrindeComponent

**Resgates (2):**
- ListaResgatesComponent
- ConfigResgateComponent

**Posts (2):**
- ListaPostsComponent
- EditorPostComponent

**Assinantes (3):**
- ListaAssinantesComponent
- EstatisticasComponent
- DetalheAssinanteComponent

**Admins (3):**
- ListaAdminsComponent
- ListaConvitesComponent
- AceitarConviteComponent

**Utilidades (1):**
- AcessoNegadoComponent

**Total: 18 componentes principais**

---

### 📌 Notas Importantes

- Todos os guards usam functional guards (CanActivateFn)
- Lazy loading implementado para melhor performance
- Query params preservados para melhor UX
- Logs detalhados para debugging
- Estrutura preparada para expansão futura
- Permissões verificadas no backend via AdminService
- Sistema completamente tipado com TypeScript

