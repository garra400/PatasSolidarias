import express from 'express';
import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Listar todos os animais (apenas campos essenciais)
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    // Retornar apenas: nome, descricao, tipo (especie), dataCriacao
    const animals = await db.collection('animals')
      .find()
      .project({
        _id: 1,
        nome: 1,
        descricao: 1,
        especie: 1,  // tipo de animal (cachorro, gato)
        criadoEm: 1   // data de criação
      })
      .toArray();
    
    // Mapear especie para tipo
    const animalsFormatted = animals.map(animal => ({
      _id: animal._id,
      nome: animal.nome,
      descricao: animal.descricao,
      tipo: animal.especie,
      dataCriacao: animal.criadoEm
    }));
    
    res.json(animalsFormatted);
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ message: 'Erro ao buscar animais' });
  }
});

// Buscar animal por ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const animal = await db.collection('animals').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }
    
    res.json(animal);
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ message: 'Erro ao buscar animal' });
  }
});

// Criar novo animal
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const animal = {
      ...req.body,
      criadoEm: new Date()
    };
    
    const result = await db.collection('animals').insertOne(animal);
    res.status(201).json({ 
      id: result.insertedId, 
      ...animal 
    });
  } catch (error) {
    console.error('Erro ao criar animal:', error);
    res.status(500).json({ message: 'Erro ao criar animal' });
  }
});

// Atualizar animal
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { _id, ...updateData } = req.body;
    
    const result = await db.collection('animals').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...updateData, atualizadoEm: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }
    
    res.json({ message: 'Animal atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar animal:', error);
    res.status(500).json({ message: 'Erro ao atualizar animal' });
  }
});

// Deletar animal
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('animals').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }
    
    res.json({ message: 'Animal removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar animal:', error);
    res.status(500).json({ message: 'Erro ao deletar animal' });
  }
});

export default router;
