import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.routes.js';
import animalRoutes from './routes/animal.routes.js';
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

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/animais', animalRoutes); // Alias em português
app.use('/api/pagamentos', paymentRoutes);
app.use('/api/user', userRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
