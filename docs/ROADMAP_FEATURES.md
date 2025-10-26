# 🗺️ Roadmap de Funcionalidades - Patas Solidárias

## ✅ **CONCLUÍDO**

### 1. Correção do Seletor de Foto em Brindes
- ✅ Ícone do presente agora é clicável
- ✅ Preview da foto é clicável
- ✅ Overlay visual ao passar o mouse
- ✅ Botão "Trocar Foto" quando já tem imagem

---

## 🔄 **EM ANDAMENTO**

### 2. Responsividade Mobile - Admin Layout
**Status:** Iniciado - Precisa ajustes finais

**O que falta:**
- Melhorar espaçamentos em telas pequenas
- Ajustar botão toggle da sidebar
- Garantir que todo conteúdo seja acessível em mobile

---

## 📋 **PENDENTE - ALTA PRIORIDADE**

### 3. Dashboard com Filtros Interativos
**Complexidade:** Média
**Tempo Estimado:** 4-6 horas

**Funcionalidades:**
1. **Filtros de Período:**
   - Semana atual
   - Mês atual
   - Ano específico
   - Período customizado

2. **Filtros por Tipo:**
   - Tipo de plano (R$ 15, R$ 30, R$ 60)
   - Combinar com período

3. **Exemplos de Visualização:**
   - "Assinantes do plano R$15 em 2025 por mês"
   - "Total de doações na semana atual"
   - "Comparativo mensal do ano"

**Arquivos a modificar:**
- `dashboard.component.ts` - Lógica de filtros
- `dashboard.component.html` - Interface de filtros
- `dashboard.component.scss` - Estilo dos filtros
- Backend: Adicionar endpoints com parâmetros de filtro

---

### 4. Sistema de Fotos de Animais
**Complexidade:** Média-Alta
**Tempo Estimado:** 5-7 horas

**Funcionalidades:**

1. **Ao Criar Animal:**
   - Foto adicionada vai automaticamente para galeria
   - Backend: Criar registro na tabela `fotos` quando animal é criado

2. **Ao Editar Animal:**
   - Opção de trocar qual foto é a "foto de perfil"
   - Modal mostrando todas as fotos do animal
   - Botão "Definir como Perfil"

3. **Filtro de Fotos por Animal (Usuário):**
   - Mostrar miniatura do animal ao lado do nome
   - Facilita identificação visual
   - Carregamento eficiente de thumbnails

**Arquivos a criar/modificar:**
- `form-animal.component.ts` - Enviar foto para galeria
- `editar-animal-modal.component.ts` - Modal de trocar foto
- `filtro-fotos.component.ts` - Adicionar miniaturas
- Backend: Endpoint para vincular foto à galeria

---

### 5. Novo Sistema de Brindes
**Complexidade:** Alta
**Tempo Estimado:** 6-8 horas

**Mudanças no Fluxo:**

**ANTES (Atual):**
- Admin cadastra brinde
- Marca "Disponível para resgate"
- Brinde aparece na home

**DEPOIS (Novo):**
- Admin cadastra brinde com apenas:
  - Nome
  - Descrição
  - Ativo/Inativo no sistema
- Em tela separada "Selecionar para Home":
  - Lista todos brindes ativos
  - Admin seleciona até 4 para aparecer na home
  - Ordem de exibição

**Arquivos a criar:**
- `selecionar-brindes-home.component.ts`
- `selecionar-brindes-home.component.html`
- `selecionar-brindes-home.component.scss`

**Arquivos a modificar:**
- `form-brinde.component` - Remover campo "disponível para resgate"
- `lista-brindes.component` - Adicionar botão "Selecionar para Home"
- Backend: Nova tabela `brindes_home` ou campo `ordem_home`

---

### 6. Sistema de Resgates com Calendário
**Complexidade:** MUITO ALTA
**Tempo Estimado:** 15-20 horas

**Funcionalidades:**

1. **Admin Marca Horários:**
   - **Por Data Específica:** "27 de novembro das 13h às 17h"
   - **Por Rotina:** "Toda segunda-feira das 13h às 14h"
   - Interface de calendário visual
   - CRUD completo de horários

2. **Usuário Marca Resgate:**
   - Vê apenas horários disponíveis
   - Seleciona data/hora
   - Confirma resgate

3. **Notificações por Email:**
   - Admin recebe email quando usuário marca
   - Usuário recebe confirmação
   - Usuário recebe aviso se admin desmarcar

4. **Admin Gerencia Resgates:**
   - Vê todos os resgates marcados
   - Filtra por "meus horários"
   - Pode desmarcar (envia email ao usuário)

**Arquivos a criar:**
- `config-horarios-resgate.component.ts` - Admin configura horários
- `calendario-resgate.component.ts` - Componente de calendário
- `meus-resgates-admin.component.ts` - Admin vê resgates
- `marcar-resgate-user.component.ts` - Usuário marca resgate
- `email.service.ts` - Serviço de notificações

**Backend a criar:**
- Tabela `horarios_admin` (id, admin_id, tipo, dia_semana, data_especifica, hora_inicio, hora_fim)
- Tabela `resgates` (id, user_id, brinde_id, horario_id, status, data_marcada)
- Endpoints de CRUD de horários
- Endpoints de marcação de resgate
- Sistema de envio de emails

---

### 7. Sistema de Convites Admin
**Complexidade:** Média
**Tempo Estimado:** 4-5 horas

**Fluxo:**

1. **Admin Envia Convite:**
   - Digita email
   - Sistema gera token único
   - Envia email com link

2. **Destinatário Recebe Email:**
   - Link para `/admin/aceitar-convite/:token`
   - Se já tem conta: faz login e vira admin
   - Se não tem conta: cadastra e vira admin

3. **Validações:**
   - Token expira em 7 dias
   - Email deve ser único
   - Rastreamento de quem convidou quem

**Arquivos a criar:**
- `convidar-admin.component.ts`
- `aceitar-convite-admin.component.ts`

**Backend:**
- Tabela `convites_admin` (id, email, token, convidado_por, status, data_expiracao)
- Endpoint POST `/api/admin/convites`
- Endpoint GET `/api/admin/convites/:token/aceitar`

---

### 8. Galeria do Usuário - Sistema de Fotos por Mês
**Complexidade:** MUITO ALTA
**Tempo Estimado:** 10-12 horas

**Regra de Negócio:**
- Usuário doador recebe fotos postadas NO MÊS em que doou
- Se doou dia 20/10 e foto foi postada dia 05/10 → RECEBE
- Se doou dia 04/02 e foto foi postada dia 02/01 → NÃO RECEBE

**Lógica:**

```javascript
// Ao adicionar foto
foto.data_postagem = new Date();
foto.mes_referencia = '2025-10'; // YYYY-MM

// Ao consultar galeria do usuário
user.historico_pagamentos.forEach(pagamento => {
  mes = pagamento.mesReferencia; // '2025-10'
  fotosDoMes = Fotos.find({ mes_referencia: mes });
  galeriaUsuario.push(...fotosDoMes);
});
```

**Arquivos a modificar:**
- Backend: Adicionar campo `mes_referencia` em fotos
- `fotos.service.ts` - Filtrar fotos por mês de pagamento
- `galeria-usuario.component.ts` - Exibir fotos corretas

**Complexidade adicional:**
- Precisa refatorar sistema de pagamentos
- Vincular mês de pagamento com fotos disponíveis
- Gerenciar caso usuário cancele e volte a doar

---

### 9. Sistema de Foto de Perfil
**Complexidade:** Média
**Tempo Estimado:** 3-4 horas

**Funcionalidades:**

1. **Sidebar Admin:**
   - Clicar no ícone da conta
   - Modal para upload de foto
   - Crop/resize opcional

2. **Sidebar Conta (Usuário):**
   - Remover email (deixar só nome)
   - Clicar no ícone para trocar foto
   - Mesmo modal de upload

3. **Backend:**
   - Campo `foto_perfil_url` em User
   - Endpoint PUT `/api/user/foto-perfil`
   - Upload para `/uploads/perfil/`

**Arquivos a criar:**
- `trocar-foto-perfil-modal.component.ts` (ou reutilizar existente)

**Arquivos a modificar:**
- `admin-layout.component.html` - Adicionar clique no ícone
- `user-layout.component.html` - Remover email, adicionar clique
- `auth.service.ts` - Incluir foto_perfil no user

---

### 10. Vincular Páginas de Conta com Admin
**Complexidade:** Média
**Tempo Estimado:** 2-3 horas

**Verificações Necessárias:**

1. **Galeria de Fotos (Usuário):**
   - ✅ Recebe fotos postadas por admin?
   - ✅ Filtra corretamente por mês de pagamento?

2. **Brindes Disponíveis (Usuário):**
   - ✅ Mostra brindes selecionados por admin?
   - ✅ Valida estoque disponível?

3. **Histórico de Pagamentos:**
   - ✅ Registra corretamente mês de referência?
   - ✅ Vínculo com galeria funciona?

4. **Resgates:**
   - ✅ Horários disponíveis são dos admins?
   - ✅ Notificações funcionam?

---

## 📊 **RESUMO DE PRIORIDADES**

### 🔴 **URGENTE (Fazer primeiro)**
1. ✅ Seletor de foto em Brindes - **CONCLUÍDO**
2. 🔄 Responsividade Mobile
3. 👤 Sistema de Foto de Perfil
4. 🐾 Fotos de Animais

### 🟡 **IMPORTANTE (Fazer em seguida)**
5. 📊 Dashboard com Filtros
6. 🎁 Novo Sistema de Brindes
7. 👥 Convites Admin

### 🟢 **IMPORTANTE MAS COMPLEXO (Fazer por último)**
8. 📅 Sistema de Resgates (MUITO COMPLEXO)
9. 🖼️ Galeria por Mês (MUITO COMPLEXO)
10. 🔗 Vincular todas as páginas

---

## 🚀 **PRÓXIMOS PASSOS RECOMENDADOS**

1. **Fazer hard refresh** e testar seletor de foto em Brindes
2. **Finalizar responsividade mobile** (ajustes de CSS)
3. **Implementar foto de perfil** (relativamente rápido e útil)
4. **Sistema de fotos de animais** (funcionalidade importante)
5. **Dashboard com filtros** (melhora UX significativamente)

Para as funcionalidades mais complexas (Resgates e Galeria por Mês), podemos fazer um planejamento mais detalhado quando chegar a hora!

---

**Última atualização:** 26/10/2025
**Funcionalidades concluídas:** 1/10
**Progresso:** 10%
