import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'patassolidarias';

let client;
let db;

export async function connectDB() {
  try {
    if (db) {
      console.log('✅ Usando conexão MongoDB existente');
      return db;
    }

    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();

    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');

    db = client.db(dbName);
    console.log(`📁 Database: ${dbName}`);

    // Verificar se a conexão está funcionando
    await db.command({ ping: 1 });
    console.log('✅ Conexão MongoDB verificada e funcionando!');

    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    console.error('💡 Verifique:');
    console.error('   1. MONGODB_URI no .env está correto');
    console.error('   2. Seu IP está na whitelist do MongoDB Atlas');
    console.error('   3. Usuário e senha estão corretos');
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database não está conectado. Chame connectDB() primeiro.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('🔌 Conexão com MongoDB fechada');
  }
}
