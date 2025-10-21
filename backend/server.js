import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.routes.js';
import animalRoutes from './routes/animal.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados
connectDB().catch(err => {
  console.error('Falha ao conectar ao banco de dados:', err);
  process.exit(1);
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/pagamentos', paymentRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
