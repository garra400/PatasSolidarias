import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Buscar meses disponíveis com fotos (para doadores)
router.get('/meses/disponiveis', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const meses = await db.collection('animais').distinct('mesDisponivel', { 
      status: 'disponivel' 
    });
    meses.sort().reverse();
    const mesesComContagem = await Promise.all(
      meses.map(async (mes) => {
        const count = await db.collection('animais').countDocuments({
          mesDisponivel: mes,
          status: 'disponivel'
        });
        return { mes, quantidade: count };
      })
    );
    res.json({ total: mesesComContagem.length, meses: mesesComContagem });
  } catch (error) {
    console.error('Erro ao buscar meses:', error);
    res.status(500).json({ error: 'Erro ao buscar meses' });
  }
});

// Buscar animais por mês
router.get('/by-month/:mesReferencia', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const animais = await db.collection('animais')
      .find({ mesDisponivel: req.params.mesReferencia, status: 'disponivel' })
      .sort({ nome: 1 })
      .toArray();
    res.json({ mesReferencia: req.params.mesReferencia, total: animais.length, animais });
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ error: 'Erro ao buscar animais' });
  }
});

// Buscar animal por ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const animal = await db.collection('animais').findOne({ _id: new ObjectId(req.params.id) });
    if (!animal) return res.status(404).json({ error: 'Animal não encontrado' });
    res.json(animal);
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ error: 'Erro ao buscar animal' });
  }
});

// Criar novo animal
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const novoAnimal = {
      ...req.body,
      tipo: req.body.tipo || 'gato',
      status: 'disponivel',
      criadoEm: new Date()
    };
    const result = await db.collection('animais').insertOne(novoAnimal);
    res.status(201).json({ message: 'Animal cadastrado', animal: { _id: result.insertedId, ...novoAnimal } });
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ error: 'Erro ao cadastrar animal' });
  }
});

export default router;
