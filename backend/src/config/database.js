import mongoose from 'mongoose';

// Configurar Mongoose para melhor performance
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false); // Desabilitar buffering de comandos
mongoose.set('bufferTimeoutMS', 10000); // Timeout de 10s

export const connectDB = async () => {
    try {
        // Remover opções deprecadas
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout de seleção de servidor
            socketTimeoutMS: 45000, // Timeout de socket
        });

        console.log(`✅ Conectado ao MongoDB Atlas com sucesso!`);
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);

        // Verificar se a conexão está realmente pronta
        if (mongoose.connection.readyState === 1) {
            console.log(`✅ Database disponível globalmente`);
        }

        // Listeners de eventos da conexão
        mongoose.connection.on('error', (err) => {
            console.error(`❌ Erro na conexão MongoDB: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB desconectado');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconectado');
        });

        return conn;
    } catch (error) {
        console.error(`❌ Erro ao conectar MongoDB: ${error.message}`);
        console.error('💡 Verifique se:');
        console.error('   1. MongoDB está rodando');
        console.error('   2. MONGODB_URI está correta no .env');
        console.error('   3. Seu IP está na whitelist do MongoDB Atlas');
        process.exit(1);
    }
};
