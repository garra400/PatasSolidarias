import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

// Pegar token da linha de comando
const token = process.argv[2];

if (!token) {
    console.log('❌ Uso: node test-token.js <TOKEN>');
    console.log('Exemplo: node test-token.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    process.exit(1);
}

try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido!');
    console.log('📋 Dados do token:', JSON.stringify(decoded, null, 2));
    console.log(`🔑 JWT_SECRET usado: ${JWT_SECRET.substring(0, 20)}...`);
} catch (error) {
    console.log('❌ Token inválido:', error.message);
    console.log(`🔑 JWT_SECRET usado: ${JWT_SECRET.substring(0, 20)}...`);
}
