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
      return db;
    }

    client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
    
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
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
