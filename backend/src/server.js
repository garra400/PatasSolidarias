import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Rotas
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import animalRoutes from './routes/animal.routes.js';
import fotoRoutes from './routes/foto.routes.js';
import brindeRoutes from './routes/brinde.routes.js';
import resgateRoutes from './routes/resgate.routes.js';
import pagamentoRoutes from './routes/pagamento.routes.js';
import postRoutes from './routes/post.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Configuração
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de Segurança
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/animais', animalRoutes);
app.use('/api/fotos', fotoRoutes);
app.use('/api/brindes', brindeRoutes);
app.use('/api/resgates', resgateRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);

// Rota de Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware de Erro (deve ser o último)
app.use(errorHandler);

// Função para iniciar o servidor
const startServer = async () => {
    try {
        // 1. Conectar ao MongoDB PRIMEIRO
        await connectDB();

        // 2. Aguardar conexão estar realmente pronta
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. DEPOIS iniciar o servidor HTTP
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
            console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✅ Servidor pronto para receber requisições!`);
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar servidor:', error);
        process.exit(1);
    }
};

// Iniciar o servidor
startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Erro não tratado:', err.message);
    console.error(err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM recebido, encerrando servidor...');
    process.exit(0);
});

export default app;
