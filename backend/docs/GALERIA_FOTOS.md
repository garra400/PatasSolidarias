# Sistema de Galeria de Fotos - Validação do Esquema

## 📋 Regras de Negócio

### Acesso à Galeria Baseado no Mês de Apoio

**Regra Principal:** Um usuário tem acesso a **todas as fotos adicionadas nos meses em que apoiou**, independentemente do dia em que fez o apoio dentro daquele mês.

### Exemplos de Cenários

#### ✅ Cenário 1: Apoio em 18/11/2025
- **Pagamento:** 18/11/2025
- **Mês de Referência:** `2025-11`
- **Acesso:** Todas as fotos com `mesReferencia = "2025-11"`
  - Foto adicionada em 01/11 ✅ TEM ACESSO
  - Foto adicionada em 14/11 ✅ TEM ACESSO
  - Foto adicionada em 18/11 ✅ TEM ACESSO
  - Foto adicionada em 25/11 ✅ TEM ACESSO
  - Foto adicionada em 30/11 ✅ TEM ACESSO

#### ❌ Cenário 2: Apoio apenas em Dezembro
- **Pagamento:** 05/12/2025
- **Mês de Referência:** `2025-12`
- **Acesso:** Apenas fotos de dezembro
  - Foto adicionada em 01/11 ❌ SEM ACESSO
  - Foto adicionada em 14/11 ❌ SEM ACESSO
  - Foto adicionada em 01/12 ✅ TEM ACESSO
  - Foto adicionada em 25/12 ✅ TEM ACESSO

#### ✅ Cenário 3: Apoio em Múltiplos Meses
- **Pagamentos:**
  - 10/10/2025 → `mesReferencia = "2025-10"`
  - 15/11/2025 → `mesReferencia = "2025-11"`
  - 08/12/2025 → `mesReferencia = "2025-12"`
- **Acesso:** Todas as fotos de outubro, novembro E dezembro
  - Foto de 05/10 ✅ TEM ACESSO
  - Foto de 14/11 ✅ TEM ACESSO
  - Foto de 20/12 ✅ TEM ACESSO
  - Foto de 05/01/2026 ❌ SEM ACESSO (não apoiou em janeiro)

## 🔧 Implementação Técnica

### 1. Modelo de Foto (`foto.model.js`)

```javascript
{
  url: String,
  descricao: String,
  animaisIds: [ObjectId],
  adicionadaPor: ObjectId,
  mesReferencia: String, // "YYYY-MM" - Mês em que a foto foi adicionada
  criadaEm: Date,
  emailEnviado: Boolean
}
```

**Campo Chave:** `mesReferencia`
- Formato: `"YYYY-MM"` (ex: `"2025-11"`)
- Calculado automaticamente quando a foto é adicionada
- Usado para filtrar acesso por usuário

### 2. Modelo de Usuário (`user.model.js`)

```javascript
{
  historicoPagamentos: [{
    tipo: String, // 'pix' ou 'assinatura'
    valor: Number,
    status: String, // 'aprovado', 'pendente', 'recusado'
    data: Date,
    mesReferencia: String // "YYYY-MM" - Mês do pagamento
  }],
  totalMesesApoio: Number
}
```

**Métodos:**
- `calcularMesesApoio()`: Conta meses únicos de apoio
- `getMesesApoio()`: Retorna array de meses em que apoiou
- `temAcessoAoMes(mesReferencia)`: Verifica acesso a um mês específico

### 3. Rotas de API

#### GET `/api/fotos/galeria/minhas-fotos` 🔒 (Autenticado)
Retorna fotos disponíveis para o usuário baseado em seus meses de apoio.

**Query Params:**
- `limit`: Limite de fotos (padrão: 50)
- `skip`: Paginação (padrão: 0)

**Resposta:**
```json
{
  "fotos": [...],
  "total": 42,
  "hasMore": true,
  "mesesApoio": ["2025-11", "2025-10", "2025-09"]
}
```

**Lógica:**
1. Busca usuário e seu `historicoPagamentos`
2. Filtra pagamentos aprovados
3. Extrai `mesReferencia` único de cada pagamento
4. Busca fotos onde `mesReferencia` está na lista de meses do usuário

#### GET `/api/fotos/galeria/estatisticas` 🔒 (Autenticado)
Retorna estatísticas da galeria do usuário.

**Resposta:**
```json
{
  "totalMesesApoio": 3,
  "mesesComAcesso": ["2025-09", "2025-10", "2025-11"],
  "totalFotosDisponiveis": 42,
  "fotosPorMes": [
    { "mes": "2025-11", "quantidade": 15 },
    { "mes": "2025-10", "quantidade": 12 },
    { "mes": "2025-09", "quantidade": 15 }
  ]
}
```

## 🧪 Casos de Teste

### Teste 1: Usuário com 1 mês de apoio
```javascript
// Setup
user.historicoPagamentos = [
  { status: 'aprovado', mesReferencia: '2025-11', data: new Date('2025-11-18') }
];

// Fotos no sistema
foto1 = { mesReferencia: '2025-11', descricao: 'Foto de nov' }; // ✅ Visível
foto2 = { mesReferencia: '2025-10', descricao: 'Foto de out' }; // ❌ Não visível
foto3 = { mesReferencia: '2025-11', descricao: 'Outra de nov' }; // ✅ Visível

// Resultado esperado
GET /api/fotos/galeria/minhas-fotos → [foto1, foto3]
```

### Teste 2: Pagamento no dia 18, foto adicionada no dia 14
```javascript
// Setup
user.historicoPagamentos = [
  { status: 'aprovado', mesReferencia: '2025-11', data: new Date('2025-11-18') }
];

foto = { mesReferencia: '2025-11', criadaEm: new Date('2025-11-14') };

// Resultado esperado
GET /api/fotos/galeria/minhas-fotos → [foto] // ✅ ACESSO GARANTIDO
```

**Justificativa:** O que importa é o `mesReferencia`, não a data específica.

### Teste 3: Múltiplos pagamentos no mesmo mês
```javascript
// Setup
user.historicoPagamentos = [
  { status: 'aprovado', mesReferencia: '2025-11', data: new Date('2025-11-05') },
  { status: 'aprovado', mesReferencia: '2025-11', data: new Date('2025-11-20') }
];

// Resultado
user.totalMesesApoio === 1 // Apenas 1 mês único
user.getMesesApoio() === ['2025-11']
```

### Teste 4: Pagamento pendente ou recusado
```javascript
// Setup
user.historicoPagamentos = [
  { status: 'pendente', mesReferencia: '2025-11' }, // ❌ Não conta
  { status: 'recusado', mesReferencia: '2025-10' }, // ❌ Não conta
  { status: 'aprovado', mesReferencia: '2025-09' }  // ✅ Conta
];

// Resultado
user.totalMesesApoio === 1 // Apenas o aprovado
user.getMesesApoio() === ['2025-09']
```

## 🔐 Segurança

### Validações Implementadas

1. **Autenticação obrigatória** para rotas de galeria pessoal
2. **Filtragem automática** baseada em `mesReferencia` do usuário
3. **Apenas pagamentos aprovados** concedem acesso
4. **Isolamento de dados** - usuário só vê suas próprias fotos disponíveis

### Prevenção de Acesso Indevido

```javascript
// ❌ NÃO FUNCIONA: Tentar acessar foto de mês sem apoio
user.mesesApoio = ['2025-11']; // Apoiou apenas em novembro
GET /api/fotos/:id onde foto.mesReferencia = '2025-10' 
→ Sistema retorna a foto mas ela não aparece na galeria pessoal

// ✅ CORRETO: Usar rota específica da galeria
GET /api/fotos/galeria/minhas-fotos 
→ Retorna APENAS fotos de '2025-11'
```

## 📊 Dashboard para Admins

### Visualizar Distribuição de Fotos

Admins podem ver quantas fotos foram adicionadas por mês:

```javascript
GET /api/admin/fotos/por-mes
→ {
  "2025-11": 25,
  "2025-10": 18,
  "2025-09": 15
}
```

## 🚀 Fluxo Completo

1. **Usuário apoia em 18/11/2025**
   - Pagamento processado
   - `mesReferencia = "2025-11"` registrado em `historicoPagamentos`
   - `totalMesesApoio` recalculado

2. **Admin adiciona fotos em qualquer dia de novembro**
   - Foto criada com `mesReferencia = "2025-11"`
   - Disponível para TODOS que apoiaram em novembro

3. **Usuário acessa galeria**
   - Sistema busca seus `mesesApoio`
   - Filtra fotos: `mesReferencia IN mesesApoio`
   - Retorna todas as fotos dos meses em que apoiou

4. **Email de notificação** (opcional)
   - Quando novas fotos são adicionadas
   - Enviado para usuários que apoiaram naquele mês
   - "Novas fotos de novembro disponíveis!"

## ✅ Validação do Esquema

O esquema implementado atende aos requisitos:
- ✅ Apoio em 18/11 → Acesso a TODAS as fotos de novembro
- ✅ Foto de 14/11 incluída mesmo para apoio em 18/11
- ✅ Apoio em dezembro NÃO dá acesso a fotos de novembro
- ✅ Múltiplos apoios no mesmo mês contam como 1 mês
- ✅ Apenas pagamentos aprovados concedem acesso
- ✅ Sistema escalável para múltiplos meses
