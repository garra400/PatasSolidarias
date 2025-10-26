import mongoose from 'mongoose';
import User from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patas-solidarias';

async function checkUserAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado ao MongoDB');

        // Pegar email da linha de comando ou usar default
        const email = process.argv[2] || 'admin@test.com';

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`❌ Usuário não encontrado: ${email}`);
            process.exit(1);
        }

        console.log('\n📋 Informações do usuário:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Nome: ${user.nome}`);
        console.log(`Email: ${user.email}`);
        console.log(`ID: ${user._id}`);
        console.log(`Role: ${user.role}`);
        console.log(`isAdmin: ${user.isAdmin}`);
        console.log(`\nPermissões:`, JSON.stringify(user.permissoes || {}, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (user.isAdmin) {
            console.log('✅ Usuário É ADMIN');
        } else {
            console.log('❌ Usuário NÃO É ADMIN');
            console.log('\n💡 Para tornar admin, execute:');
            console.log(`   node set-admin.js ${email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

checkUserAdmin();
