# ✅ Checklist de Verificação - Patas Solidárias

## 🔧 Backend Setup

### Configuração Inicial
- [ ] MongoDB instalado e rodando (`mongod`)
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`cd backend && npm install`)
- [ ] Arquivo `.env` criado e configurado:
  - [ ] `MONGODB_URI` apontando para MongoDB local
  - [ ] `JWT_SECRET` com chave segura
  - [ ] Cloudinary configurado (CLOUD_NAME, API_KEY, API_SECRET)
  - [ ] Email configurado (Gmail com senha de app)
  - [ ] `FRONTEND_URL=http://localhost:4200`

### Teste Backend
- [ ] Backend iniciado (`npm run dev`)
- [ ] Console mostra: "✅ Servidor rodando na porta 3000"
- [ ] Console mostra: "✅ MongoDB conectado com sucesso!"
- [ ] Acesso à API: `http://localhost:3000/api`

---

## 🎨 Frontend Setup

### Configuração
- [ ] Dependências instaladas (`npm install`)
- [ ] Environment configurado (`src/environments/environment.development.ts`)
- [ ] `apiUrl: 'http://localhost:3000/api'` configurado

### Teste Frontend
- [ ] Frontend iniciado (`npm start`)
- [ ] Console sem erros de compilação
- [ ] Aplicação abre em `http://localhost:4200`

---

## 🧪 Testes Funcionais

### Autenticação
- [ ] **Registro:**
  - [ ] Acessar `/registro`
  - [ ] Preencher formulário completo
  - [ ] Verificar console: "✅ Registro bem-sucedido"
  - [ ] Verificar email de confirmação recebido
  - [ ] Clicar no link de verificação

- [ ] **Login:**
  - [ ] Acessar `/login`
  - [ ] Fazer login com usuário criado
  - [ ] Verificar redirecionamento para `/conta`
  - [ ] Verificar token salvo no localStorage
  - [ ] Verificar header mostra avatar/menu

### Sidebar - Desktop (>968px)

#### Área Cliente
- [ ] **Home (`/`):**
  - [ ] Botão global aparece no canto esquerdo
  - [ ] Clicar no botão abre sidebar
  - [ ] Sidebar mostra todas as opções
  - [ ] Opções condicionais baseadas em `isDoador`

- [ ] **Área /conta:**
  - [ ] Botão global continua visível
  - [ ] Sidebar funciona normalmente
  - [ ] Links de navegação funcionam

#### Área Admin
- [ ] **Painel Admin (`/admin`):**
  - [ ] Botão global NÃO aparece
  - [ ] Botão toggle roxo aparece no canto esquerdo
  - [ ] Sidebar admin abre/fecha corretamente
  - [ ] Sidebar mostra opções de admin

### Sidebar - Mobile (≤968px)

#### Área Cliente
- [ ] **Home (`/`):**
  - [ ] Botão global aparece no canto esquerdo
  - [ ] Sidebar responsiva funciona
  - [ ] Overlay aparece ao abrir

- [ ] **Área /conta:**
  - [ ] Botão global NÃO aparece
  - [ ] Botão do header aparece
  - [ ] Clicar no botão do header abre sidebar
  - [ ] Sidebar fecha ao clicar em link

#### Área Admin
- [ ] **Painel Admin (`/admin`):**
  - [ ] Botão toggle admin visível
  - [ ] Sidebar responsiva
  - [ ] Fecha ao clicar fora
  - [ ] Fecha ao clicar em link

### Navbar

#### Área Cliente (não logado)
- [ ] Links: "Home", "Conheça nossas patinhas", "Campanha"
- [ ] Botão "Seja um padrinho" visível

#### Área Cliente (logado)
- [ ] Links: "Home", "Minha Galeria", "Meus Brindes"
- [ ] Menu do usuário funciona
- [ ] Avatar com iniciais aparece

#### Área Admin
- [ ] Navbar customizada aparece
- [ ] Links admin: "Dashboard", "Animais", "Apoiadores"
- [ ] Ícones aparecem junto aos links
- [ ] Cor roxa aplicada

### Footer
- [ ] **Área Cliente:** Footer azul
- [ ] **Área Admin:** Footer roxo
- [ ] Oculto em páginas de autenticação (/login, /registro)

---

## 🔐 Testes de Segurança

### Guards
- [ ] Tentar acessar `/conta` sem login → redireciona para `/login`
- [ ] Tentar acessar `/admin` sem ser admin → redireciona ou erro 403
- [ ] Tentar acessar rotas de doador sem ser doador → redireciona

### JWT Token
- [ ] Token salvo no localStorage após login
- [ ] Token enviado no header `Authorization` automaticamente
- [ ] Logout remove token do localStorage

---

## 📱 Testes Responsivos

### Breakpoints
- [ ] **Desktop (>968px):** Layout desktop
- [ ] **Tablet (768-968px):** Layout intermediário
- [ ] **Mobile (<768px):** Layout mobile

### Elementos Responsivos
- [ ] Header responsivo
- [ ] Sidebars responsivas
- [ ] Cards adaptam-se à tela
- [ ] Footer responsivo
- [ ] Botões de tamanho adequado (touch-friendly)

---

## 🎨 Testes Visuais

### Cores e Branding
- [ ] **Área Cliente:** Verde/azul (#2d3f8d, #7c3aed)
- [ ] **Área Admin:** Roxo (#667eea, #764ba2)
- [ ] Footer com cores corretas
- [ ] Botões com gradientes

### Animações
- [ ] Sidebar abre/fecha com transição suave
- [ ] Hover effects nos links
- [ ] Botões com efeito de elevação ao hover
- [ ] Overlay fade in/out

---

## 🐛 Casos de Borda

### Backend Offline
- [ ] Frontend usa mock automaticamente
- [ ] Mensagem de aviso (opcional)
- [ ] Funcionalidade básica continua

### Erros de API
- [ ] Credenciais inválidas → mensagem de erro clara
- [ ] Email já existe → mensagem específica
- [ ] Formulário inválido → validação visual

### Navegação
- [ ] Voltar/avançar do navegador funciona
- [ ] Refresh mantém sessão (se token válido)
- [ ] Deep links funcionam

---

## 📊 Métricas de Performance

### Carregamento
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Bundle size razoável

### Network
- [ ] Requests desnecessários minimizados
- [ ] Imagens otimizadas
- [ ] API calls eficientes

---

## 🔄 Testes de Integração

### Fluxo Completo: Novo Usuário
1. [ ] Acessar home
2. [ ] Clicar em "Seja um padrinho"
3. [ ] Registrar conta
4. [ ] Verificar email
5. [ ] Fazer login
6. [ ] Acessar dashboard
7. [ ] Navegar pelas páginas
8. [ ] Fazer logout

### Fluxo Completo: Admin
1. [ ] Login como admin
2. [ ] Acessar `/admin`
3. [ ] Verificar navbar customizada
4. [ ] Abrir sidebar admin
5. [ ] Navegar entre páginas admin
6. [ ] Voltar para área cliente
7. [ ] Fazer logout

---

## 📝 Documentação

- [ ] README.md atualizado
- [ ] ALTERACOES.md criado
- [ ] Comentários no código claros
- [ ] Arquivo .env.example no backend

---

## ✨ Resultado Esperado

Ao final deste checklist, você deve ter:

✅ Backend rodando sem erros
✅ Frontend conectado ao backend
✅ Autenticação funcionando (JWT)
✅ Sidebar comportando-se corretamente em todas as telas
✅ Navbar customizada no admin
✅ Footer com cores corretas
✅ Sistema responsivo
✅ Guards protegendo rotas
✅ Sem erros de console

---

**Status:** 🟡 Pronto para testes
**Próximo passo:** Executar este checklist item por item

---

💡 **Dica:** Use o console do navegador (F12) para verificar:
- Requisições à API (aba Network)
- Erros JavaScript (aba Console)
- Token JWT no localStorage (aba Application → Local Storage)
