# Sistema de Controle de Apoiadores - Patas Solidárias

## 📋 Visão Geral

Sistema completo para controlar apoiadores (doadores) através de pagamentos PIX avulsos e assinaturas mensais, com cálculo automático de meses de apoio e brindes disponíveis.

---

## 🗄️ Estrutura do Banco de Dados (MongoDB)

### Schema do Usuário

```javascript
{
  _id: ObjectId,
  nome: String,
  email: String (unique),
  telefone: String,
  cpf: String (unique),
  senha: String (hash),
  role: 'user' | 'admin',
  isDoador: Boolean,  // ✅ Calculado automaticamente
  emailVerificado: Boolean,
  dataCriacao: Date,
  
  // Assinatura Ativa
  assinaturaAtiva: {
    tipo: 'mensal' | 'avulso',
    valorMensal: Number,
    dataInicio: Date,
    dataProximoPagamento: Date,
    status: 'ativa' | 'cancelada' | 'suspensa'
  },
  
  // Histórico de Pagamentos
  historicoPagamentos: [{
    tipo: 'pix' | 'assinatura',
    valor: Number,
    status: 'aprovado' | 'pendente' | 'recusado',
    data: Date,
    mercadoPagoId: String,
    mesReferencia: String  // Ex: "2025-10"
  }],
  
  // Calculados automaticamente
  totalMesesApoio: Number,      // ✅ Total de meses únicos
  brindesDisponiveis: Number    // ✅ totalMesesApoio / 3
}
```

---

## 🔄 Como Funciona o Cálculo

### Método: `calcularMesesApoio()`

**Localização:** `backend/models/user.model.js`

```javascript
// 1. Filtra apenas pagamentos aprovados
// 2. Extrai meses de referência únicos (ex: "2025-10", "2025-11")
// 3. Conta quantos meses únicos existem
// 4. Calcula brindes: Math.floor(totalMesesApoio / 3)
// 5. Atualiza isDoador baseado em meses ou assinatura ativa
```

### Exemplo Prático:

```javascript
// Usuário fez 5 pagamentos:
historicoPagamentos: [
  { mesReferencia: "2025-10", status: "aprovado" },  // PIX Outubro
  { mesReferencia: "2025-10", status: "aprovado" },  // Assinatura Outubro
  { mesReferencia: "2025-11", status: "aprovado" },  // Assinatura Novembro
  { mesReferencia: "2025-12", status: "aprovado" },  // Assinatura Dezembro
  { mesReferencia: "2025-12", status: "pendente" }   // ❌ Ignorado
]

// Resultado:
totalMesesApoio: 3       // (Out, Nov, Dez)
brindesDisponiveis: 1    // 3 / 3 = 1 brinde
isDoador: true
```

---

## 🚀 Endpoints da API

### Base URL: `/api/pagamentos`

#### 1️⃣ **Registrar PIX Avulso**
```http
POST /api/pagamentos/pix
Authorization: Bearer {token}
Content-Type: application/json

{
  "valor": 30.00,
  "mercadoPagoId": "mp_123456"
}
```

**Resposta:**
```json
{
  "message": "Pagamento registrado com sucesso!",
  "totalMesesApoio": 1,
  "brindesDisponiveis": 0,
  "isDoador": true
}
```

---

#### 2️⃣ **Criar Assinatura Mensal**
```http
POST /api/pagamentos/assinatura
Authorization: Bearer {token}
Content-Type: application/json

{
  "valorMensal": 30.00,
  "mercadoPagoId": "sub_123456"
}
```

**Resposta:**
```json
{
  "message": "Assinatura criada com sucesso!",
  "assinatura": {
    "tipo": "mensal",
    "valorMensal": 30.00,
    "dataInicio": "2025-10-21T...",
    "dataProximoPagamento": "2025-11-21T...",
    "status": "ativa"
  },
  "totalMesesApoio": 1,
  "brindesDisponiveis": 0,
  "isDoador": true
}
```

---

#### 3️⃣ **Cancelar Assinatura**
```http
POST /api/pagamentos/assinatura/cancelar
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "message": "Assinatura cancelada com sucesso"
}
```

---

#### 4️⃣ **Obter Histórico**
```http
GET /api/pagamentos/historico
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "historicoPagamentos": [
    {
      "tipo": "pix",
      "valor": 30.00,
      "status": "aprovado",
      "data": "2025-10-21T...",
      "mercadoPagoId": "mp_123",
      "mesReferencia": "2025-10"
    }
  ],
  "totalMesesApoio": 3,
  "brindesDisponiveis": 1,
  "isDoador": true,
  "assinaturaAtiva": {
    "status": "ativa",
    "valorMensal": 30.00,
    "dataProximoPagamento": "2025-11-21T..."
  }
}
```

---

#### 5️⃣ **Webhook MercadoPago** (Pagamentos Recorrentes)
```http
POST /api/pagamentos/webhook/mercadopago
Content-Type: application/json

{
  "userId": "user_id_aqui",
  "valor": 30.00,
  "mercadoPagoId": "payment_123",
  "status": "approved"
}
```

---

## 💻 Uso no Frontend (Angular)

### PaymentService

```typescript
// Injetar o serviço
constructor(private paymentService: PaymentService) {}

// Registrar PIX
this.paymentService.registrarPix({ valor: 30.00, mercadoPagoId: 'mp_123' })
  .subscribe({
    next: (response) => {
      console.log('Total de meses:', response.totalMesesApoio);
      console.log('Brindes disponíveis:', response.brindesDisponiveis);
    }
  });

// Criar assinatura
this.paymentService.criarAssinatura({ valorMensal: 30.00 })
  .subscribe({
    next: (response) => {
      console.log('Assinatura criada!', response.assinatura);
    }
  });

// Obter histórico
this.paymentService.getHistoricoPagamentos()
  .subscribe({
    next: (dados) => {
      console.log('Meses de apoio:', dados.totalMesesApoio);
      console.log('É doador?', dados.isDoador);
      console.log('Pagamentos:', dados.historicoPagamentos);
    }
  });
```

---

## 📊 Regras de Negócio

### ✅ **isDoador = true** quando:
1. `totalMesesApoio > 0` (tem pagamentos aprovados), OU
2. `assinaturaAtiva.status === 'ativa'`

### 📦 **Cálculo de Brindes:**
```
brindesDisponiveis = Math.floor(totalMesesApoio / 3)

Exemplos:
- 0-2 meses → 0 brindes
- 3-5 meses → 1 brinde
- 6-8 meses → 2 brindes
- 9-11 meses → 3 brindes
```

### 📅 **Mês de Referência:**
- Formato: `YYYY-MM` (ex: "2025-10")
- Gerado automaticamente na data do pagamento
- Múltiplos pagamentos no mesmo mês contam como 1 mês
- Apenas pagamentos com `status: "aprovado"` são contados

---

## 🔐 Segurança

- ✅ Todas as rotas protegidas com JWT (`verifyToken`)
- ✅ Token enviado no header: `Authorization: Bearer {token}`
- ✅ Usuário só acessa seus próprios dados
- ✅ Webhook do MercadoPago deve ter validação adicional (implementar em produção)

---

## 🧪 Como Testar

### 1. Registrar um PIX:
```bash
curl -X POST http://localhost:3000/api/pagamentos/pix \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"valor": 30.00, "mercadoPagoId": "test_pix_123"}'
```

### 2. Ver histórico:
```bash
curl -X GET http://localhost:3000/api/pagamentos/historico \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📁 Arquivos Criados

1. **Backend:**
   - `backend/models/user.model.js` - Schema do MongoDB com método `calcularMesesApoio()`
   - `backend/routes/payment.routes.js` - Rotas de pagamento
   - `backend/middleware/auth.middleware.js` - Middleware de autenticação
   - `backend/server.js` - Atualizado com rotas de pagamento

2. **Frontend:**
   - `src/app/service/payment.service.ts` - Serviço para consumir API

---

## 🎯 Próximos Passos

1. **Integração com MercadoPago:**
   - Implementar SDK do MercadoPago
   - Criar preferências de pagamento
   - Configurar webhook real

2. **Interface de Pagamento:**
   - Componente para escolher entre PIX e Assinatura
   - Formulário de checkout
   - Confirmação de pagamento

3. **Dashboard do Usuário:**
   - Exibir totalMesesApoio
   - Mostrar brindesDisponiveis
   - Listar histórico de pagamentos
   - Botão para cancelar assinatura

---

## ❓ Dúvidas Comuns

**P: E se o usuário fizer 2 PIX no mesmo mês?**  
R: Conta como 1 mês apenas (mesReferencia único).

**P: Como processar pagamentos recorrentes?**  
R: Configure webhook do MercadoPago para chamar `/api/pagamentos/webhook/mercadopago`.

**P: Quando o `isDoador` é atualizado?**  
R: Sempre que `calcularMesesApoio()` é chamado (após qualquer pagamento ou cancelamento).

**P: Como resetar brindes após resgate?**  
R: Criar rota `/api/pagamentos/resgatar-brinde` que decrementa `brindesDisponiveis`.
