import { connectDB, getDB } from './db.js';

async function checkUser(email) {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await connectDB();
    
    const db = getDB();
    const users = db.collection('users');
    
    console.log(`\n🔍 Buscando usuário: ${email}`);
    const user = await users.findOne({ email });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      process.exit(0);
    }
    
    console.log('\n✅ Usuário encontrado:');
    console.log('📧 Email:', user.email);
    console.log('👤 Nome:', user.nome);
    console.log('📱 Telefone:', user.telefone);
    console.log('🆔 CPF:', user.cpf);
    console.log('👥 Tipo:', user.tipo);
    console.log('✉️  Email Confirmado:', user.emailConfirmado ? '✅ SIM' : '❌ NÃO');
    
    if (!user.emailConfirmado) {
      console.log('\n🔑 Token de Confirmação:', user.confirmationToken);
      console.log('⏰ Token expira em:', user.tokenExpiry);
      console.log('\n📎 Link de confirmação:');
      console.log(`http://localhost:4200/confirmar-email?token=${user.confirmationToken}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

// Pegar email dos argumentos da linha de comando
const email = process.argv[2];

if (!email) {
  console.log('❌ Por favor, forneça um email como argumento');
  console.log('Uso: node check-user.js email@exemplo.com');
  process.exit(1);
}

checkUser(email);
