import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://garra400:Jogue%408adbc@patassolidarias.smzhfbd.mongodb.net/?retryWrites=true&w=majority&appName=PatasSolidarias';
const dbName = 'patassolidarias';

async function popularAnimais() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('animais');

    // Limpar coleção existente (opcional)
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`⚠️  Encontrados ${count} animais existentes. Removendo...`);
      await collection.deleteMany({});
    }

    // Animais para cadastrar
    const animais = [
      {
        nome: 'Tigrão',
        descricao: 'Gatinho tigrado super carinhoso e brincalhão. Adora fazer companhia e ronronar no colo.',
        fotoUrl: '/assets/images/tigrao.jpg',
        mesDisponivel: '2025-10', // Outubro 2025
        tipo: 'gato',
        idade: 'Jovem (1-2 anos)',
        sexo: 'macho',
        status: 'disponivel',
        historia: 'Tigrão foi resgatado das ruas ainda filhote. Hoje é um gato saudável que busca um lar amoroso.',
        caracteristicas: ['Carinhoso', 'Brincalhão', 'Sociável', 'Vacinado', 'Castrado'],
        necessidadesEspeciais: false,
        detalhesNecessidades: '',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      },
      {
        nome: 'Pretinha',
        descricao: 'Gatinha preta elegante e independente. Muito inteligente e observadora.',
        fotoUrl: '/assets/images/pretinha.jpg',
        mesDisponivel: '2025-11', // Novembro 2025
        tipo: 'gato',
        idade: 'Adulta (3-5 anos)',
        sexo: 'femea',
        status: 'disponivel',
        historia: 'Pretinha chegou ao abrigo após ser abandonada. É uma gata calma que se dá bem com outros pets.',
        caracteristicas: ['Calma', 'Independente', 'Inteligente', 'Vacinada', 'Castrada'],
        necessidadesEspeciais: false,
        detalhesNecessidades: '',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      },
      {
        nome: 'Gatinha',
        descricao: 'Gatinha doce e gentil, perfeita para famílias. Adora crianças e é muito paciente.',
        fotoUrl: '/assets/images/gata.jpg',
        mesDisponivel: '2025-12', // Dezembro 2025
        tipo: 'gato',
        idade: 'Jovem (1-2 anos)',
        sexo: 'femea',
        status: 'disponivel',
        historia: 'Gatinha foi encontrada grávida e cuidamos dela e de seus filhotes. Todos foram adotados e agora é a vez dela!',
        caracteristicas: ['Dócil', 'Maternal', 'Calma', 'Vacinada', 'Castrada'],
        necessidadesEspeciais: false,
        detalhesNecessidades: '',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      },
      {
        nome: 'Fúria',
        descricao: 'Gatinha cheia de energia e personalidade forte. Muito ativa e aventureira.',
        fotoUrl: '/assets/images/furia.jpg',
        mesDisponivel: '2026-01', // Janeiro 2026
        tipo: 'gato',
        idade: 'Jovem (1-2 anos)',
        sexo: 'femea',
        status: 'disponivel',
        historia: 'Fúria recebeu esse nome pela sua personalidade marcante. Precisa de um tutor experiente que respeite seu espaço.',
        caracteristicas: ['Energética', 'Independente', 'Ativa', 'Vacinada', 'Castrada'],
        necessidadesEspeciais: false,
        detalhesNecessidades: '',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      },
      {
        nome: 'Berenice',
        descricao: 'Gatinha idosa e sábia, busca um lar tranquilo para seus anos dourados.',
        fotoUrl: '/assets/images/berenice.jpg',
        mesDisponivel: '2026-02', // Fevereiro 2026
        tipo: 'gato',
        idade: 'Idosa (8+ anos)',
        sexo: 'femea',
        status: 'disponivel',
        historia: 'Berenice foi resgatada após seu tutor falecer. É uma gata amorosa que merece viver seus últimos anos com conforto.',
        caracteristicas: ['Calma', 'Carinhosa', 'Tranquila', 'Vacinada', 'Castrada'],
        necessidadesEspeciais: true,
        detalhesNecessidades: 'Necessita de alimentação especial para gatos idosos e acompanhamento veterinário regular.',
        criadoEm: new Date(),
        atualizadoEm: new Date()
      }
    ];

    // Inserir animais
    const result = await collection.insertMany(animais);
    console.log(`\n✅ ${result.insertedCount} animais cadastrados com sucesso!\n`);

    // Mostrar resumo
    console.log('📋 Resumo dos animais cadastrados:\n');
    for (const animal of animais) {
      console.log(`  🐱 ${animal.nome}`);
      console.log(`     Mês: ${animal.mesDisponivel}`);
      console.log(`     ${animal.descricao}`);
      console.log('');
    }

    // Verificar coleção
    const total = await collection.countDocuments();
    console.log(`\n✅ Total de animais no banco: ${total}`);

  } catch (error) {
    console.error('❌ Erro ao popular animais:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
}

// Executar
popularAnimais();
