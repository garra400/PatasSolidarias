# 📋 Lista Completa de Testes - Patas Solidárias

## ✅ Funcionalidades Implementadas para Testar

---

## 1️⃣ **SISTEMA DE FOTO DE PERFIL DE USUÁRIO**

### 🎯 Objetivo
Permitir que usuários e admins façam upload, visualizem e removam sua foto de perfil.

### ✅ **Teste 1.1: Upload de Foto de Perfil (Área Admin)**
1. Faça login como admin
2. Vá para qualquer página do painel administrativo (`/adm/*`)
3. Observe a sidebar do admin (ícone do escudo/badge)
4. Clique no ícone do admin na sidebar
5. **Resultado esperado:** Modal de "Trocar Foto de Perfil" deve abrir
6. Clique em "Escolher Foto"
7. Selecione uma imagem (JPG, PNG, etc - máx 5MB)
8. **Resultado esperado:** Preview da foto deve aparecer
9. Clique em "Salvar"
10. **Resultado esperado:** 
    - Mensagem de sucesso
    - Foto aparece no ícone do admin na sidebar
    - Modal fecha automaticamente

### ✅ **Teste 1.2: Upload de Foto de Perfil (Área Usuário)**
1. Faça login como usuário normal
2. Vá para a área de conta (`/conta/perfil` ou qualquer `/conta/*`)
3. Observe a sidebar do usuário (avatar circular)
4. Clique no avatar (deve ter um ícone de câmera 📷 ao passar o mouse)
5. **Resultado esperado:** Modal de "Trocar Foto de Perfil" deve abrir
6. Siga os mesmos passos do teste 1.1 (passos 6-10)

### ✅ **Teste 1.3: Visualização da Foto na Home**
1. Após fazer upload da foto (teste 1.1 ou 1.2)
2. Vá para a home (`/`)
3. Clique no menu hambúrguer (☰) no topo
4. **Resultado esperado:**
    - Sidebar lateral abre
    - Sua foto de perfil aparece no topo
    - Apenas nome (sem email)

### ✅ **Teste 1.4: Remover Foto de Perfil**
1. Abra o modal de foto de perfil (admin ou usuário)
2. Se já tem foto, clique em "Remover Foto"
3. Confirme a remoção
4. **Resultado esperado:**
    - Mensagem de sucesso
    - Avatar volta para o padrão (ícone roxo)
    - Modal fecha

### ✅ **Teste 1.5: Validações**
1. Tente fazer upload de arquivo maior que 5MB
   - **Esperado:** Mensagem de erro "A imagem deve ter no máximo 5MB"
2. Tente fazer upload de arquivo não-imagem (PDF, TXT, etc)
   - **Esperado:** Mensagem de erro "Por favor, selecione uma imagem válida"

### ✅ **Teste 1.6: Persistência**
1. Faça upload de uma foto
2. Faça logout
3. Faça login novamente
4. **Resultado esperado:** Foto continua aparecendo em todas as sidebars

### ✅ **Teste 1.7: Responsividade Mobile**
1. Abra o site em um celular ou redimensione o navegador (< 768px)
2. A sidebar deve estar fechada por padrão
3. Clique no menu
4. **Resultado esperado:** 
    - Sidebar abre
    - Foto de perfil visível
    - Avatar clicável
    - Modal funciona normalmente

### ✅ **Teste 1.8: Responsividade Desktop**
1. Abra o site em desktop (>= 1025px)
2. Vá para `/conta/perfil`
3. **Resultado esperado:**
    - Sidebar já abre automaticamente
    - Foto visível imediatamente

---

## 2️⃣ **SISTEMA DE FOTOS DE ANIMAIS**

### 🎯 Objetivo
Auto-adicionar fotos à galeria ao criar/editar animais e permitir seleção de foto de perfil dentre as fotos da galeria.

### ✅ **Teste 2.1: Criar Animal com Foto**
1. Login como admin
2. Vá para `/adm/animais`
3. Clique em "Novo Animal"
4. Preencha os dados:
   - Nome: "Rex Teste"
   - Tipo: Cachorro
   - Descrição: "Animal de teste com foto automática"
   - Ativo: ✓
5. Faça upload de uma foto
6. Clique em "Criar Animal"
7. **Resultado esperado:**
    - Animal criado com sucesso
    - Foto aparece no card do animal
8. Vá para `/adm/fotos` (galeria de fotos)
9. **Resultado esperado:**
    - A foto do Rex Teste aparece na galeria
    - Descrição: "Foto de perfil de Rex Teste"
    - Animal vinculado: Rex Teste

### ✅ **Teste 2.2: Editar Animal e Adicionar Nova Foto**
1. Vá para `/adm/animais`
2. Clique em "Editar" em algum animal existente
3. Faça upload de uma **nova** foto (diferente da atual)
4. Clique em "Atualizar Animal"
5. **Resultado esperado:**
    - Animal atualizado
    - Nova foto aparece como foto de perfil
6. Vá para `/adm/fotos`
7. **Resultado esperado:**
    - A nova foto foi adicionada à galeria
    - Animal tem agora 2 fotos na galeria (antiga + nova)

### ✅ **Teste 2.3: Modal de Seleção de Foto de Perfil**
1. Edite um animal que já tenha múltiplas fotos na galeria
2. Clique no botão "🖼️ Escolher da Galeria"
3. **Resultado esperado:**
    - Modal abre mostrando todas as fotos desse animal
    - Grid de fotos (3-4 colunas)
    - Foto de perfil atual tem badge dourado "⭐ Perfil Atual"
4. Clique em uma foto diferente
5. **Resultado esperado:**
    - Foto selecionada tem overlay roxo com ✓
    - Check mark aparece
6. Clique em "Definir como Perfil"
7. **Resultado esperado:**
    - Mensagem de sucesso
    - Preview no formulário atualiza
    - Modal fecha

### ✅ **Teste 2.4: Modal sem Fotos**
1. Crie um animal SEM fazer upload de foto
2. Edite esse animal
3. Clique em "🖼️ Escolher da Galeria"
4. **Resultado esperado:**
    - Modal abre
    - Mensagem: "Nenhuma foto encontrada para este animal"
    - Botão "Definir como Perfil" desabilitado

### ✅ **Teste 2.5: Thumbnails no Filtro de Fotos (Usuário)**
1. Faça login como **usuário** (não admin)
2. Vá para `/conta/fotos`
3. Observe a seção de filtros
4. **Resultado esperado:**
    - Dropdown "Nome do Animal" com emojis (🐕/🐱)
    - Grid de thumbnails abaixo do dropdown
    - Cada thumbnail mostra:
      - Foto redonda (60x60px)
      - Nome do animal embaixo
5. Passe o mouse sobre um thumbnail
6. **Resultado esperado:**
    - Thumbnail levanta 2px
    - Sombra aparece
7. Clique em um thumbnail
8. **Resultado esperado:**
    - Thumbnail fica com borda roxa
    - Fundo lilás
    - Filtro de fotos é aplicado (mostra só fotos daquele animal)

### ✅ **Teste 2.6: Thumbnails - Animal sem Foto**
1. Crie um animal sem foto
2. Vá para `/conta/fotos`
3. **Resultado esperado:**
    - Thumbnail do animal aparece
    - Em vez de foto, mostra emoji (🐕/🐱/🐾)
    - Fundo cinza degradê
    - Nome do animal aparece

---

## 3️⃣ **FILTROS DE DASHBOARD**

### 🎯 Objetivo
Permitir filtrar gráficos do dashboard por período (semana/mês/ano) e plano (R$15/30/60).

### ✅ **Teste 3.1: Filtro por Período - Semana**
1. Login como admin
2. Vá para `/adm/dashboard`
3. Role até a seção "Análises Visuais"
4. Observe os filtros no topo direito
5. Selecione "📅 Semana Atual" no filtro "Período"
6. **Resultado esperado:**
    - Gráfico de barras atualiza IMEDIATAMENTE
    - Labels mudam para: Dom, Seg, Ter, Qua, Qui, Sex, Sáb
    - Dados do gráfico atualizam (números diferentes)

### ✅ **Teste 3.2: Filtro por Período - Mês**
1. Selecione "📊 Mês Atual"
2. **Resultado esperado:**
    - Labels mudam para: Sem 1, Sem 2, Sem 3, Sem 4
    - Gráfico mostra 4 barras (semanas do mês)

### ✅ **Teste 3.3: Filtro por Período - Ano**
1. Selecione "📈 Ano Completo"
2. **Resultado esperado:**
    - Labels mudam para: Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez
    - Gráfico mostra 12 barras (meses do ano)

### ✅ **Teste 3.4: Filtro por Plano - R$15**
1. Selecione "💚 R$ 15,00" no filtro "Tipo de Plano"
2. **Resultado esperado:**
    - Gráfico de donut (segundo gráfico) atualiza
    - Mostra apenas "Plano R$15"
    - Cor roxa (#667eea)
    - 100% preenchido

### ✅ **Teste 3.5: Filtro por Plano - R$30**
1. Selecione "💙 R$ 30,00"
2. **Resultado esperado:**
    - Donut mostra "Plano R$30"
    - Cor verde (#48bb78)

### ✅ **Teste 3.6: Filtro por Plano - R$60**
1. Selecione "💛 R$ 60,00"
2. **Resultado esperado:**
    - Donut mostra "Plano R$60"
    - Cor laranja (#ed8936)

### ✅ **Teste 3.7: Filtro por Plano - Todos**
1. Selecione "Todos os Planos"
2. **Resultado esperado:**
    - Donut mostra 3 fatias:
      - R$15 (roxo)
      - R$30 (verde)
      - R$60 (laranja)
    - Distribuição proporcional

### ✅ **Teste 3.8: Combinação de Filtros**
1. Selecione "Ano Completo" + "R$ 30,00"
2. **Resultado esperado:**
    - Gráfico de barras mostra 12 meses
    - Gráfico de donut mostra só plano R$30
    - Ambos atualizam simultaneamente

### ✅ **Teste 3.9: Botão Limpar Filtros**
1. Aplique alguns filtros (ex: Semana + R$15)
2. Clique no botão "🔄 Limpar"
3. **Resultado esperado:**
    - Filtros voltam para o padrão
    - Período: Mês Atual
    - Plano: Todos os Planos
    - Gráficos atualizam automaticamente

### ✅ **Teste 3.10: Responsividade Mobile - Filtros**
1. Redimensione navegador para mobile (< 768px)
2. Vá para `/adm/dashboard`
3. **Resultado esperado:**
    - Filtros aparecem empilhados (vertical)
    - Cada dropdown ocupa largura total
    - Botão "Limpar" ocupa largura total
    - Tudo ainda funcional

---

## 4️⃣ **TESTES DE INTEGRAÇÃO**

### ✅ **Teste 4.1: Fluxo Completo - Criar Animal → Ver Galeria → Filtrar Fotos**
1. Login como admin
2. Crie um novo animal com foto: "Luna"
3. Vá para `/adm/fotos`
4. **Esperado:** Foto de Luna aparece
5. Faça logout e login como usuário
6. Vá para `/conta/fotos`
7. **Esperado:** Foto de Luna NÃO aparece (usuário comum não vê fotos ainda não publicadas)

### ✅ **Teste 4.2: Foto de Perfil Persiste Entre Páginas**
1. Faça upload de foto de perfil
2. Navegue para diferentes páginas:
   - Home → Dashboard → Perfil → Animais → Brindes
3. **Esperado:** 
   - Foto aparece em todas as sidebars
   - Nunca volta para o placeholder padrão

### ✅ **Teste 4.3: Múltiplos Animais com Thumbnails**
1. Certifique-se de ter pelo menos 5 animais com fotos
2. Vá para `/conta/fotos`
3. **Esperado:**
   - Todos os 5+ animais aparecem como thumbnails
   - Grid responsivo (3-4 por linha em desktop)
   - Todos clicáveis
   - Filtro funciona para cada um

### ✅ **Teste 4.4: Dashboard com Dados Reais**
1. Certifique-se de ter alguns assinantes no sistema
2. Vá para `/adm/dashboard`
3. **Esperado:**
   - Cards de estatísticas mostram números reais
   - "Total de Apoiadores" > 0
   - Gráficos renderizam corretamente
   - Filtros funcionam mesmo com dados reais

---

## 5️⃣ **TESTES DE REGRESSÃO**

### ✅ **Teste 5.1: Funcionalidades Antigas Ainda Funcionam**
1. **Brindes:**
   - Criar/editar/deletar brinde
   - Foto do brinde clicável
   - Lista de brindes carrega
2. **Animais:**
   - Lista de animais carrega
   - Cards mostram fotos
   - Busca funciona
3. **Posts:**
   - Criar post
   - Enviar newsletter
4. **Assinantes:**
   - Ver lista
   - Filtrar por plano

### ✅ **Teste 5.2: Navegação Funciona Corretamente**
1. Vá para cada rota admin:
   - `/adm/dashboard` ✓
   - `/adm/animais` ✓
   - `/adm/fotos` ✓
   - `/adm/brindes` ✓
   - `/adm/assinantes` ✓
   - `/adm/posts` ✓
2. **Esperado:** Nenhum erro 404, tudo carrega

### ✅ **Teste 5.3: Autenticação e Guards**
1. Tente acessar `/adm/dashboard` sem login
   - **Esperado:** Redirecionado para login
2. Login como usuário normal
3. Tente acessar `/adm/dashboard`
   - **Esperado:** Bloqueado (401 ou redirect)

---

## 6️⃣ **TESTES DE ERRO E EDGE CASES**

### ✅ **Teste 6.1: Criar Animal SEM Foto**
1. Crie um animal sem fazer upload de foto
2. **Esperado:**
   - Animal criado com sucesso
   - Card mostra placeholder (🐕/🐱)
   - Nenhuma foto adicionada à galeria

### ✅ **Teste 6.2: Upload de Imagem Corrompida**
1. Tente fazer upload de arquivo renomeado (.txt → .jpg)
2. **Esperado:**
   - Erro de validação OU
   - Preview não carrega OU
   - Backend rejeita

### ✅ **Teste 6.3: Conexão com Backend Offline**
1. Pare o servidor backend (`Ctrl+C` no terminal node)
2. Tente fazer upload de foto de perfil
3. **Esperado:**
   - Mensagem de erro amigável
   - "Erro ao atualizar foto de perfil"
   - Sistema não quebra

### ✅ **Teste 6.4: Filtros com Dados Vazios**
1. Dashboard sem nenhum assinante
2. Aplique filtros
3. **Esperado:**
   - Gráficos mostram "Sem dados"
   - Não quebra
   - Filtros continuam funcionais

---

## 📊 **RESUMO DE COBERTURA**

| Funcionalidade | Testes | Status |
|---|---|---|
| Foto de Perfil Usuário | 8 testes | ⏳ Aguardando |
| Sistema de Fotos Animais | 6 testes | ⏳ Aguardando |
| Filtros de Dashboard | 10 testes | ⏳ Aguardando |
| Integração | 4 testes | ⏳ Aguardando |
| Regressão | 3 testes | ⏳ Aguardando |
| Edge Cases | 4 testes | ⏳ Aguardando |
| **TOTAL** | **35 testes** | **0% concluído** |

---

## 🚀 **COMO EXECUTAR OS TESTES**

### Pré-requisitos:
1. ✅ Backend rodando na porta 3000
2. ✅ Frontend rodando na porta 4200
3. ✅ Banco de dados MongoDB conectado

### Ordem Sugerida:
1. **Comece pelos testes de Foto de Perfil** (1.1 a 1.8)
2. **Depois Sistema de Fotos de Animais** (2.1 a 2.6)
3. **Em seguida Filtros de Dashboard** (3.1 a 3.10)
4. **Testes de Integração** (4.1 a 4.4)
5. **Regressão e Edge Cases** (5.1 a 6.4)

### Reportar Problemas:
Ao encontrar um bug, anote:
- ✅ Número do teste (ex: "Teste 2.3")
- ✅ O que você fez (passos exatos)
- ✅ O que esperava acontecer
- ✅ O que aconteceu de fato
- ✅ Print/screenshot se possível
- ✅ Mensagens de erro no console (F12)

---

## ✅ **CHECKLIST RÁPIDO**

Marque com ✓ conforme vai testando:

- [ ] Teste 1.1: Upload foto admin
- [ ] Teste 1.2: Upload foto usuário
- [ ] Teste 1.3: Foto na home
- [ ] Teste 1.4: Remover foto
- [ ] Teste 1.5: Validações
- [ ] Teste 1.6: Persistência
- [ ] Teste 1.7: Mobile
- [ ] Teste 1.8: Desktop
- [ ] Teste 2.1: Criar animal com foto
- [ ] Teste 2.2: Editar e adicionar foto
- [ ] Teste 2.3: Modal seleção
- [ ] Teste 2.4: Modal sem fotos
- [ ] Teste 2.5: Thumbnails filtro
- [ ] Teste 2.6: Thumbnails sem foto
- [ ] Teste 3.1: Filtro semana
- [ ] Teste 3.2: Filtro mês
- [ ] Teste 3.3: Filtro ano
- [ ] Teste 3.4: Plano R$15
- [ ] Teste 3.5: Plano R$30
- [ ] Teste 3.6: Plano R$60
- [ ] Teste 3.7: Todos planos
- [ ] Teste 3.8: Combinação filtros
- [ ] Teste 3.9: Limpar filtros
- [ ] Teste 3.10: Mobile filtros
- [ ] Teste 4.1: Fluxo completo
- [ ] Teste 4.2: Foto persiste
- [ ] Teste 4.3: Múltiplos animais
- [ ] Teste 4.4: Dashboard dados reais
- [ ] Teste 5.1: Funcionalidades antigas
- [ ] Teste 5.2: Navegação
- [ ] Teste 5.3: Autenticação
- [ ] Teste 6.1: Animal sem foto
- [ ] Teste 6.2: Imagem corrompida
- [ ] Teste 6.3: Backend offline
- [ ] Teste 6.4: Filtros vazios

---

**Última atualização:** 26/10/2025
**Total de testes:** 35
**Tempo estimado:** 2-3 horas

Boa sorte nos testes! 🎉
