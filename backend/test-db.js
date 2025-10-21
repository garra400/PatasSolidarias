import { connectDB, closeDB } from './db.js';
import bcrypt from 'bcryptjs';

async function testDatabase() {
  try {
    console.log('🧪 Iniciando testes do banco de dados...\n');

    // 1. Testar conexão
    console.log('1️⃣ Testando conexão com MongoDB...');
    const db = await connectDB();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // 2. Testar inserção de usuário
    console.log('2️⃣ Testando inserção de usuário...');
    const users = db.collection('users');
    
    const testUser = {
      nome: 'Teste Usuario',
      email: 'teste@exemplo.com',
      senha: await bcrypt.hash('senha123', 10),
      telefone: '(41) 99999-9999',
      endereco: 'Rua Teste, 123 - Medianeira/PR',
      cpf: '123.456.789-00',
      tipo: 'adotante',
      criadoEm: new Date()
    };

    const resultUser = await users.insertOne(testUser);
    console.log('✅ Usuário inserido com ID:', resultUser.insertedId);
    console.log('   Nome:', testUser.nome);
    console.log('   Email:', testUser.email, '\n');

    // 3. Testar busca de usuário
    console.log('3️⃣ Testando busca de usuário...');
    const foundUser = await users.findOne({ email: 'teste@exemplo.com' });
    console.log('✅ Usuário encontrado:', foundUser.nome);
    console.log('   ID:', foundUser._id, '\n');

    // 4. Testar inserção de animais
    console.log('4️⃣ Testando inserção de animais...');
    const animals = db.collection('animals');

    const testAnimals = [
      {
        nome: 'Rex',
        especie: 'cachorro',
        raca: 'Labrador',
        idade: 3,
        porte: 'grande',
        sexo: 'macho',
        descricao: 'Cachorro muito dócil e brincalhão',
        fotos: ['/assets/logo.jpg'],
        status: 'disponivel',
        criadoEm: new Date()
      },
      {
        nome: 'Mimi',
        especie: 'gato',
        raca: 'Siamês',
        idade: 2,
        porte: 'pequeno',
        sexo: 'femea',
        descricao: 'Gatinha carinhosa e independente',
        fotos: ['/assets/logo.jpg'],
        status: 'disponivel',
        criadoEm: new Date()
      },
      {
        nome: 'Thor',
        especie: 'cachorro',
        raca: 'Pastor Alemão',
        idade: 4,
        porte: 'grande',
        sexo: 'macho',
        descricao: 'Cão protetor e leal',
        fotos: ['/assets/logo.jpg'],
        status: 'disponivel',
        criadoEm: new Date()
      }
    ];

    const resultAnimals = await animals.insertMany(testAnimals);
    console.log('✅ Inseridos', Object.keys(resultAnimals.insertedIds).length, 'animais');
    testAnimals.forEach((animal, index) => {
      console.log(`   ${index + 1}. ${animal.nome} (${animal.especie})`);
    });
    console.log('');

    // 5. Testar busca de animais
    console.log('5️⃣ Testando busca de animais...');
    const allAnimals = await animals.find().toArray();
    console.log('✅ Total de animais no banco:', allAnimals.length);
    console.log('');

    // 6. Testar atualização
    console.log('6️⃣ Testando atualização de animal...');
    const updateResult = await animals.updateOne(
      { nome: 'Rex' },
      { $set: { descricao: 'Cachorro muito dócil, brincalhão e obediente' } }
    );
    console.log('✅ Animal atualizado:', updateResult.modifiedCount, 'documento(s)');
    const updatedAnimal = await animals.findOne({ nome: 'Rex' });
    console.log('   Nova descrição:', updatedAnimal.descricao);
    console.log('');

    // 7. Testar contagem
    console.log('7️⃣ Testando contagens...');
    const countUsers = await users.countDocuments();
    const countAnimals = await animals.countDocuments();
    const countDogs = await animals.countDocuments({ especie: 'cachorro' });
    const countCats = await animals.countDocuments({ especie: 'gato' });
    console.log('✅ Estatísticas:');
    console.log('   Total de usuários:', countUsers);
    console.log('   Total de animais:', countAnimals);
    console.log('   Cachorros:', countDogs);
    console.log('   Gatos:', countCats);
    console.log('');

    // 8. Listar coleções
    console.log('8️⃣ Listando coleções no banco...');
    const collections = await db.listCollections().toArray();
    console.log('✅ Coleções existentes:');
    collections.forEach(col => {
      console.log('   -', col.name);
    });
    console.log('');

    // 9. Estatísticas finais
    console.log('9️⃣ Resumo final:');
    console.log('✅ Todos os testes passaram com sucesso!');
    console.log('📊 Banco de dados:', db.databaseName);
    console.log('🔗 Conexão: MongoDB Atlas');
    console.log('');

    console.log('⚠️  ATENÇÃO: Dados de teste foram inseridos no banco!');
    console.log('   Se quiser limpar os dados de teste, execute: npm run clean-test-data');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    await closeDB();
    console.log('\n🔌 Conexão com banco de dados fechada');
  }
}

// Executar testes
testDatabase();
