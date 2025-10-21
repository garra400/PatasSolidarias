import { connectDB, closeDB } from './db.js';

async function cleanTestData() {
  try {
    console.log('🧹 Limpando dados de teste...\n');

    const db = await connectDB();

    // Deletar usuário de teste
    const users = db.collection('users');
    const resultUser = await users.deleteOne({ email: 'teste@exemplo.com' });
    console.log('✅ Usuários de teste deletados:', resultUser.deletedCount);

    // Deletar animais de teste
    const animals = db.collection('animals');
    const resultAnimals = await animals.deleteMany({ 
      nome: { $in: ['Rex', 'Mimi', 'Thor'] } 
    });
    console.log('✅ Animais de teste deletados:', resultAnimals.deletedCount);

    console.log('\n✨ Limpeza concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
  } finally {
    await closeDB();
  }
}

cleanTestData();
