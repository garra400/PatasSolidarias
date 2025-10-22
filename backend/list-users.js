import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patassolidarias';
const DB_NAME = process.env.DB_NAME || 'patassolidarias';

async function listUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB Atlas');
    console.log('📦 Database:', DB_NAME);

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    const allUsers = await users.find({}).toArray();
    
    console.log('\n📋 Usuários cadastrados:');
    console.log('═'.repeat(80));
    
    if (allUsers.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. 👤 ${user.nome || 'Sem nome'}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   É Doador: ${user.isDoador || false}`);
        console.log(`   Email Confirmado: ${user.emailConfirmado || user.emailVerificado || false}`);
        console.log(`   Role: ${user.role || user.tipo || 'user'}`);
        if (user.totalMesesApoio) {
          console.log(`   Meses de Apoio: ${user.totalMesesApoio}`);
          console.log(`   Brindes: ${user.brindesDisponiveis || 0}`);
        }
      });
    }
    
    console.log('\n═'.repeat(80));
    console.log(`Total: ${allUsers.length} usuário(s)`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

listUsers();
