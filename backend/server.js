import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.routes.js';
import animalRoutes from './routes/animal.routes.js';
import fotoRoutes from './routes/foto.routes.js';
import brindeRoutes from './routes/brinde.routes.js';
import resgateRoutes from './routes/resgate.routes.js';
import postRoutes from './routes/post.routes.js';
import adminRoutes from './routes/admin.routes.js';
import assinanteRoutes from './routes/assinante.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conectar ao banco de dados e armazenar no app.locals
connectDB()
  .then(db => {
    app.locals.db = db;
    console.log('✅ Database disponível globalmente');
  })
  .catch(err => {
    console.error('Falha ao conectar ao banco de dados:', err);
    process.exit(1);
  });

// Conectar Mongoose ao MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://garra10:garrasenha123@cluster0.1nxz9.mongodb.net/patassolidarias?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Mongoose conectado ao MongoDB Atlas'))
  .catch(err => {
    console.error('❌ Erro ao conectar Mongoose:', err);
    process.exit(1);
  });

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/animais', animalRoutes); // Alias em português
app.use('/api/fotos', fotoRoutes);
app.use('/api/brindes', brindeRoutes);
app.use('/api/resgates', resgateRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assinantes', assinanteRoutes);
app.use('/api/pagamentos', paymentRoutes);
app.use('/api/user', userRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // 1. Conectar ao MongoDB PRIMEIRO
    await connectDB();

    // 2. Aguardar conexão estabilizar
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Database disponível globalmente');

    // 3. DEPOIS iniciar o servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`✅ Servidor pronto para receber requisições!`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();
