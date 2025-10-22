import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patassolidarias';
const DB_NAME = process.env.DB_NAME || 'patassolidarias';
const userId = '68f820cb28129d90c5d1be2d';

async function diagnosticoUsuario() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB Atlas');
    console.log('📦 Database:', DB_NAME);
    console.log('═'.repeat(80));

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      console.log('❌ Usuário não encontrado!');
      return;
    }

    console.log('\n📋 DADOS COMPLETOS DO USUÁRIO:');
    console.log('═'.repeat(80));
    console.log('\n👤 Informações Básicas:');
    console.log('   _id:', user._id.toString());
    console.log('   Nome:', user.nome);
    console.log('   Email:', user.email);
    console.log('   Telefone:', user.telefone || 'não informado');
    console.log('   CPF:', user.cpf || 'não informado');
    
    console.log('\n🔐 Autenticação:');
    console.log('   Email Confirmado:', user.emailConfirmado || false);
    console.log('   Role/Tipo:', user.role || user.tipo || 'user');
    
    console.log('\n💰 Status de Doador:');
    console.log('   isDoador:', user.isDoador || false);
    console.log('   Total Meses Apoio:', user.totalMesesApoio || 0);
    console.log('   Brindes Disponíveis:', user.brindesDisponiveis || 0);
    
    if (user.assinaturaAtiva) {
      console.log('\n📋 Assinatura Ativa:');
      console.log('   Tipo:', user.assinaturaAtiva.tipo);
      console.log('   Valor Mensal: R$', user.assinaturaAtiva.valorMensal?.toFixed(2));
      console.log('   Status:', user.assinaturaAtiva.status);
      console.log('   Data Início:', new Date(user.assinaturaAtiva.dataInicio).toLocaleDateString('pt-BR'));
      console.log('   Próximo Pagamento:', new Date(user.assinaturaAtiva.dataProximoPagamento).toLocaleDateString('pt-BR'));
    } else {
      console.log('\n📋 Assinatura Ativa: Nenhuma');
    }
    
    if (user.historicoPagamentos && user.historicoPagamentos.length > 0) {
      console.log('\n💳 Histórico de Pagamentos:');
      user.historicoPagamentos.forEach((pag, index) => {
        console.log(`   ${index + 1}. ${pag.tipo.toUpperCase()} - R$ ${pag.valor.toFixed(2)}`);
        console.log(`      Status: ${pag.status} | Mês: ${pag.mesReferencia}`);
        console.log(`      Data: ${new Date(pag.data).toLocaleDateString('pt-BR')}`);
      });
    } else {
      console.log('\n💳 Histórico de Pagamentos: Vazio');
    }
    
    console.log('\n═'.repeat(80));
    console.log('\n🔍 VERIFICAÇÃO:');
    
    if (user.isDoador) {
      console.log('   ✅ isDoador = true → Deve ter acesso a área de doador');
    } else {
      console.log('   ❌ isDoador = false → NÃO tem acesso a área de doador');
    }
    
    if (user.assinaturaAtiva?.status === 'ativa') {
      console.log('   ✅ Assinatura ativa → Deve esconder "Seja Apoiador"');
    } else {
      console.log('   ⚠️  Sem assinatura ativa → "Seja Apoiador" aparece');
    }
    
    if (user.totalMesesApoio >= 3) {
      console.log(`   ✅ ${user.totalMesesApoio} meses → ${user.brindesDisponiveis} brinde(s) disponível(is)`);
    }
    
    console.log('\n═'.repeat(80));
    console.log('\n📤 OBJETO QUE DEVE SER RETORNADO NO LOGIN:');
    console.log('═'.repeat(80));
    
    const userResponse = {
      _id: user._id.toString(),
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || '',
      cpf: user.cpf || '',
      role: user.role || user.tipo || 'user',
      isDoador: user.isDoador || false,
      emailVerificado: user.emailConfirmado || false,
      dataCriacao: user.criadoEm || new Date(),
      assinaturaAtiva: user.assinaturaAtiva,
      historicoPagamentos: user.historicoPagamentos || [],
      totalMesesApoio: user.totalMesesApoio || 0,
      brindesDisponiveis: user.brindesDisponiveis || 0
    };
    
    console.log(JSON.stringify(userResponse, null, 2));
    console.log('\n═'.repeat(80));

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

diagnosticoUsuario();
