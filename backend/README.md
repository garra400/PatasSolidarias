# Backend - Patas Solidárias

API REST para o sistema Patas Solidárias conectado ao MongoDB Atlas.

## 🚀 Como iniciar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
O arquivo `.env` já está configurado com a conexão do MongoDB Atlas.

### 3. Iniciar o servidor
```bash
npm start
# ou em modo desenvolvimento com auto-reload:
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

## 📡 Endpoints disponíveis

### Autenticação
- **POST** `/api/auth/register` - Registrar novo usuário
- **POST** `/api/auth/login` - Fazer login
- **POST** `/api/auth/reset-password` - Recuperar senha

### Animais
- **GET** `/api/animals` - Listar todos os animais
- **GET** `/api/animals/:id` - Buscar animal por ID
- **POST** `/api/animals` - Criar novo animal
- **PUT** `/api/animals/:id` - Atualizar animal
- **DELETE** `/api/animals/:id` - Deletar animal

### Teste
- **GET** `/api/health` - Verificar se o servidor está funcionando

## 🔄 Conectar o Frontend

No arquivo `src/environments/environment.ts`, altere:
```typescript
useMockData: false // Usar backend real
```

## 📦 Estrutura do Banco de Dados

### Coleção: `users`
```json
{
  "_id": "ObjectId",
  "nome": "string",
  "email": "string",
  "senha": "string (hash)",
  "telefone": "string",
  "endereco": "string",
  "cpf": "string",
  "tipo": "adotante | admin",
  "criadoEm": "Date"
}
```

### Coleção: `animals`
```json
{
  "_id": "ObjectId",
  "nome": "string",
  "especie": "cachorro | gato",
  "raca": "string",
  "idade": "number",
  "porte": "pequeno | medio | grande",
  "sexo": "macho | femea",
  "descricao": "string",
  "fotos": ["string"],
  "status": "disponivel | adotado",
  "criadoEm": "Date",
  "atualizadoEm": "Date"
}
```

## 🔐 Segurança
- Senhas são criptografadas com bcrypt
- Autenticação via JWT (JSON Web Token)
- CORS habilitado para o frontend Angular
