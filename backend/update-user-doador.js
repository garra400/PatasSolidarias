import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patassolidarias';
const DB_NAME = process.env.DB_NAME || 'patassolidarias';
const userId = '68f820cb28129d90c5d1be2d';

async function updateUserAsDoador() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB Atlas');
    console.log('📦 Database:', DB_NAME);

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    // Criar histórico de pagamentos de exemplo (3 meses)
    const pagamentos = [
      {
        tipo: 'assinatura',
        valor: 30.00,
        status: 'aprovado',
        data: new Date('2025-08-01'),
        mercadoPagoId: 'MP-TEST-001',
        mesReferencia: '2025-08'
      },
      {
        tipo: 'assinatura',
        valor: 30.00,
        status: 'aprovado',
        data: new Date('2025-09-01'),
        mercadoPagoId: 'MP-TEST-002',
        mesReferencia: '2025-09'
      },
      {
        tipo: 'assinatura',
        valor: 30.00,
        status: 'aprovado',
        data: new Date('2025-10-01'),
        mercadoPagoId: 'MP-TEST-003',
        mesReferencia: '2025-10'
      }
    ];

    // Atualizar usuário
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isDoador: true,
          role: 'user',
          totalMesesApoio: 3,
          brindesDisponiveis: 1, // 3 meses / 3 = 1 brinde
          assinaturaAtiva: {
            tipo: 'mensal',
            valorMensal: 30.00,
            dataInicio: new Date('2025-08-01'),
            dataProximoPagamento: new Date('2025-11-01'),
            status: 'ativa'
          },
          historicoPagamentos: pagamentos
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log('❌ Usuário não encontrado com ID:', userId);
    } else {
      console.log('✅ Usuário atualizado com sucesso!');
      console.log('\n📊 Dados configurados:');
      console.log('   - isDoador: true');
      console.log('   - totalMesesApoio: 3 meses');
      console.log('   - brindesDisponiveis: 1 brinde');
      console.log('   - Assinatura mensal ativa: R$ 30,00');
      console.log('   - Histórico: 3 pagamentos aprovados');
      console.log('\n🎉 Você já pode testar a interface de doador!');
    }

    // Verificar o usuário atualizado
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log('\n👤 Usuário atual:');
    console.log('   Nome:', updatedUser.nome);
    console.log('   Email:', updatedUser.email);
    console.log('   É Doador:', updatedUser.isDoador);
    console.log('   Meses de Apoio:', updatedUser.totalMesesApoio);
    console.log('   Brindes Disponíveis:', updatedUser.brindesDisponiveis);

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Conexão fechada');
  }
}

updateUserAsDoador();
