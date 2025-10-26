import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String,
    role: { type: String, default: 'user' },
    isDoador: { type: Boolean, default: false },
    emailVerificado: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function setAdmin() {
    try {
        console.log('🔌 Conectando ao MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado!\n');

        const email = process.argv[2] || 'seu_email@example.com'; // Passe o email como argumento

        // Buscar usuário
        let user = await User.findOne({ email });

        if (!user) {
            console.log('👤 Usuário não encontrado. Criando novo admin...');

            // Criar novo usuário admin
            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            user = new User({
                nome: 'João Victor',
                email: email,
                senha: hashedPassword,
                role: 'admin',
                emailVerificado: true,
                isDoador: false
            });

            await user.save();
            console.log('✅ Usuário admin criado com sucesso!');
            console.log('📧 Email:', email);
            console.log('🔑 Senha temporária: Admin@123');
            console.log('⚠️  IMPORTANTE: Altere esta senha após o primeiro login!\n');
        } else {
            console.log('👤 Usuário encontrado:', user.nome);
            console.log('📊 Status atual:');
            console.log('   Role:', user.role);
            console.log('   Email verificado:', user.emailVerificado);
            console.log('   É doador:', user.isDoador);
            console.log('');

            // Atualizar para admin
            user.role = 'admin';
            user.emailVerificado = true;
            await user.save();

            console.log('✅ Usuário atualizado para ADMIN!');
            console.log('📊 Novo status:');
            console.log('   Role:', user.role);
            console.log('   Email verificado:', user.emailVerificado);
            console.log('');
        }

        console.log('═'.repeat(60));
        console.log('✅ Processo concluído com sucesso!');
        console.log('🔑 Você pode fazer login com:');
        console.log('   Email:', email);
        console.log('   Senha: (sua senha atual)');
        console.log('═'.repeat(60));

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexão fechada');
    }
}

setAdmin();
