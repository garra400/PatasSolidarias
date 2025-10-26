import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    role: String,
    isDoador: Boolean,
    emailVerificado: Boolean,
    totalMesesApoio: { type: Number, default: 0 },
    brindesDisponiveis: { type: Number, default: 0 },
    assinaturaAtiva: {
        status: String,
        valorMensal: Number,
        dataInicio: Date,
        proximaCobranca: Date,
        stripeSubscriptionId: String
    }
}, { timestamps: true });

const pagamentoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    valor: Number,
    tipo: String, // 'doacao_unica' ou 'assinatura'
    status: String, // 'pendente', 'aprovado', 'rejeitado'
    metodoPagamento: String,
    stripePaymentIntentId: String,
    descricao: String,
    dataPagamento: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Pagamento = mongoose.model('Pagamento', pagamentoSchema);

async function addTestDonations() {
    try {
        console.log('🔌 Conectando ao MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado!\n');

        const email = 'joaovicgomes.10@gmail.com';

        // Buscar usuário
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ Usuário não encontrado!');
            return;
        }

        console.log('👤 Usuário encontrado:', user.nome);
        console.log('📊 Status atual:');
        console.log('   É doador:', user.isDoador);
        console.log('   Total meses apoio:', user.totalMesesApoio);
        console.log('   Brindes disponíveis:', user.brindesDisponiveis);
        console.log('');

        // Criar doações de teste
        const doacoesParaCriar = [
            {
                usuario: user._id,
                valor: 50.00,
                tipo: 'doacao_unica',
                status: 'aprovado',
                metodoPagamento: 'credit_card',
                stripePaymentIntentId: `pi_test_${Date.now()}_1`,
                descricao: 'Doação única de teste',
                dataPagamento: new Date('2025-01-15')
            },
            {
                usuario: user._id,
                valor: 30.00,
                tipo: 'assinatura',
                status: 'aprovado',
                metodoPagamento: 'credit_card',
                stripePaymentIntentId: `pi_test_${Date.now()}_2`,
                descricao: 'Mensalidade - Janeiro/2025',
                dataPagamento: new Date('2025-02-15')
            },
            {
                usuario: user._id,
                valor: 30.00,
                tipo: 'assinatura',
                status: 'aprovado',
                metodoPagamento: 'credit_card',
                stripePaymentIntentId: `pi_test_${Date.now()}_3`,
                descricao: 'Mensalidade - Fevereiro/2025',
                dataPagamento: new Date('2025-03-15')
            },
            {
                usuario: user._id,
                valor: 30.00,
                tipo: 'assinatura',
                status: 'aprovado',
                metodoPagamento: 'credit_card',
                stripePaymentIntentId: `pi_test_${Date.now()}_4`,
                descricao: 'Mensalidade - Março/2025',
                dataPagamento: new Date('2025-04-15')
            },
            {
                usuario: user._id,
                valor: 100.00,
                tipo: 'doacao_unica',
                status: 'aprovado',
                metodoPagamento: 'pix',
                stripePaymentIntentId: `pi_test_${Date.now()}_5`,
                descricao: 'Doação única via PIX',
                dataPagamento: new Date('2025-05-20')
            }
        ];

        console.log('💰 Criando doações de teste...');
        const doacoesCriadas = await Pagamento.insertMany(doacoesParaCriar);
        console.log(`✅ ${doacoesCriadas.length} doações criadas!\n`);

        // Atualizar usuário
        const totalMesesAssinatura = doacoesParaCriar.filter(d => d.tipo === 'assinatura').length;
        const totalDoacoes = doacoesParaCriar.length;

        user.isDoador = true;
        user.totalMesesApoio = totalMesesAssinatura;
        user.brindesDisponiveis = Math.floor(totalMesesAssinatura / 3); // 1 brinde a cada 3 meses

        // Adicionar assinatura ativa
        user.assinaturaAtiva = {
            status: 'active',
            valorMensal: 30.00,
            dataInicio: new Date('2025-02-15'),
            proximaCobranca: new Date('2025-11-15'),
            stripeSubscriptionId: `sub_test_${Date.now()}`
        };

        await user.save();

        console.log('✅ Usuário atualizado!');
        console.log('📊 Novo status:');
        console.log('   É doador:', user.isDoador);
        console.log('   Total meses apoio:', user.totalMesesApoio);
        console.log('   Brindes disponíveis:', user.brindesDisponiveis);
        console.log('   Assinatura ativa:', user.assinaturaAtiva.status);
        console.log('   Valor mensal: R$', user.assinaturaAtiva.valorMensal.toFixed(2));
        console.log('');

        console.log('═'.repeat(70));
        console.log('✅ Processo concluído com sucesso!');
        console.log('');
        console.log('📋 RESUMO DAS DOAÇÕES:');
        console.log('   • Doações únicas: 2 (R$ 150,00)');
        console.log('   • Mensalidades: 3 (R$ 90,00)');
        console.log('   • Total doado: R$ 240,00');
        console.log('   • Brindes disponíveis:', user.brindesDisponiveis);
        console.log('   • Assinatura ativa: Sim (R$ 30,00/mês)');
        console.log('═'.repeat(70));

    } catch (error) {
        console.error('❌ Erro:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexão fechada');
    }
}

addTestDonations();
