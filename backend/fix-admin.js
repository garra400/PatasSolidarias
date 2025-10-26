import mongoose from 'mongoose';
import User from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patas-solidarias';

async function fixAndUpdateAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado ao MongoDB');

        const email = process.argv[2] || 'seu_email@example.com'; // Passe o email como argumento

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`❌ Usuário não encontrado: ${email}`);
            process.exit(1);
        }

        console.log(`\n👤 Corrigindo e atualizando usuário: ${user.nome}`);
        console.log(`📧 Email: ${user.email}`);

        // Corrigir status da assinatura se existir
        if (user.assinaturaAtiva && user.assinaturaAtiva.status === 'active') {
            console.log('🔧 Corrigindo status da assinatura: active → ativa');
            user.assinaturaAtiva.status = 'ativa';
        }

        // Atualizar para admin com todas as permissões
        console.log('\n📝 Aplicando permissões de admin...\n');
        user.isAdmin = true;
        user.permissoes = {
            gerenciarAnimais: true,
            gerenciarFotos: true,
            gerenciarBrindes: true,
            gerenciarPosts: true,
            visualizarAssinantes: true,
            convidarAdmins: true,
            gerenciarConfiguracoes: true
        };

        await user.save();

        console.log('✅ Usuário atualizado com sucesso!');
        console.log('\n📋 Detalhes:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Nome: ${user.nome}`);
        console.log(`Email: ${user.email}`);
        console.log(`isAdmin: ${user.isAdmin}`);
        console.log(`\nPermissões:`);
        console.log(JSON.stringify(user.permissoes, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🎉 Agora você pode fazer login e acessar o painel admin!\n');
        console.log('⚠️  IMPORTANTE: Você precisa fazer LOGOUT e LOGIN novamente para as alterações fazerem efeito!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

fixAndUpdateAdmin();
