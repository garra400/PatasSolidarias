import express from 'express';
import Animal from '../models/animal.model.js';
import Foto from '../models/foto.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';
import { uploadSingle, uploadFotoPerfil } from '../middleware/upload.middleware.js';

const router = express.Router();

// GET - Listar todos os animais (público)
router.get('/', async (req, res) => {
  try {
    const { tipo, ativo, limit, skip = 0 } = req.query;

    let query = {};
    if (tipo) query.tipo = tipo;
    if (ativo !== undefined) query.ativo = ativo === 'true';

    let queryBuilder = Animal.find(query)
      .populate('fotoPerfilId')
      .sort({ criadoEm: -1 });

    if (limit) {
      queryBuilder = queryBuilder.limit(parseInt(limit));
    }

    if (skip) {
      queryBuilder = queryBuilder.skip(parseInt(skip));
    }

    const animais = await queryBuilder;
    const total = await Animal.countDocuments(query);

    res.json({ animais, total });
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ error: 'Erro ao buscar animais' });
  }
});

// GET - Buscar meses disponíveis com fotos
router.get('/meses/disponiveis', async (req, res) => {
  try {
    const meses = await Animal.distinct('mesDisponivel', { ativo: true });
    meses.sort().reverse();

    const mesesComContagem = await Promise.all(
      meses.map(async (mes) => {
        const count = await Animal.countDocuments({
          mesDisponivel: mes,
          ativo: true
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

// GET - Buscar animais por mês
router.get('/by-month/:mesReferencia', async (req, res) => {
  try {
    const animais = await Animal.find({
      mesDisponivel: req.params.mesReferencia,
      ativo: true
    })
      .populate('fotoPerfilId')
      .sort({ nome: 1 });

    res.json({
      mesReferencia: req.params.mesReferencia,
      total: animais.length,
      animais
    });
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ error: 'Erro ao buscar animais' });
  }
});

// GET - Buscar animais ativos/disponíveis (deve vir ANTES de /:id)
router.get('/active', async (req, res) => {
  try {
    const animais = await Animal.find({ ativo: true })
      .populate('fotoPerfilId')
      .sort({ criadoEm: -1 });

    res.json({
      total: animais.length,
      animais
    });
  } catch (error) {
    console.error('Erro ao buscar animais ativos:', error);
    res.status(500).json({ error: 'Erro ao buscar animais ativos' });
  }
});

// GET - Buscar animal por ID
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('fotoPerfilId');

    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado' });
    }

    // Buscar fotos associadas a este animal
    const fotos = await Foto.find({ animaisIds: animal._id })
      .sort({ criadaEm: -1 });

    res.json({ ...animal.toObject(), fotos });
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ error: 'Erro ao buscar animal' });
  }
});

// POST - Criar animal (admin)
router.post('/',
  verifyToken,
  isAdmin,
  checkPermission(PERMISSOES.GERENCIAR_ANIMAIS),
  uploadFotoPerfil,
  async (req, res) => {
    try {
      console.log('📝 Criando animal - Body:', req.body);
      console.log('📸 Arquivo recebido:', req.file);

      const animalData = { ...req.body };

      // Converter string 'true'/'false' para boolean se necessário
      if (animalData.ativo !== undefined) {
        animalData.ativo = animalData.ativo === 'true' || animalData.ativo === true;
      }

      // Criar o animal primeiro
      const animal = new Animal(animalData);
      await animal.save();

      console.log('✅ Animal criado com sucesso:', animal._id);

      // Se uma foto foi enviada, criar registro na galeria
      if (req.file) {
        const fotoUrl = `/uploads/animais/${req.file.filename}`;
        console.log('📸 Criando foto na galeria:', fotoUrl);

        // Calcular mês de referência
        const agora = new Date();
        const mesReferencia = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

        // Criar foto na galeria
        const foto = new Foto({
          url: fotoUrl,
          descricao: `Foto de perfil de ${animal.nome}`,
          animaisIds: [animal._id],
          adicionadaPor: req.user._id,
          mesReferencia,
          emailEnviado: false
        });

        await foto.save();
        console.log('✅ Foto adicionada à galeria:', foto._id);

        // Atualizar animal com a foto de perfil e URL
        animal.fotoPerfilId = foto._id;
        animal.fotoUrl = fotoUrl;
        await animal.save();

        console.log('✅ Animal atualizado com foto de perfil');
      }

      // Retornar animal populado
      const animalPopulado = await Animal.findById(animal._id)
        .populate('fotoPerfilId');

      res.status(201).json({
        message: 'Animal cadastrado com sucesso',
        animal: animalPopulado
      });
    } catch (error) {
      console.error('❌ Erro ao cadastrar animal:', error);
      res.status(500).json({
        error: 'Erro ao cadastrar animal',
        detalhes: error.message
      });
    }
  }
);

// PUT - Atualizar animal (admin)
router.put('/:id',
  verifyToken,
  isAdmin,
  checkPermission(PERMISSOES.GERENCIAR_ANIMAIS),
  uploadFotoPerfil,
  async (req, res) => {
    try {
      console.log('📝 Atualizando animal - Body:', req.body);
      console.log('📸 Arquivo recebido:', req.file);

      const updateData = { ...req.body };

      // Converter string 'true'/'false' para boolean se necessário
      if (updateData.ativo !== undefined) {
        updateData.ativo = updateData.ativo === 'true' || updateData.ativo === true;
      }

      // Buscar animal atual
      const animalAtual = await Animal.findById(req.params.id);
      if (!animalAtual) {
        return res.status(404).json({ error: 'Animal não encontrado' });
      }

      // Se uma nova foto foi enviada, adicionar à galeria
      if (req.file) {
        const fotoUrl = `/uploads/animais/${req.file.filename}`;
        console.log('📸 Criando nova foto na galeria:', fotoUrl);

        // Calcular mês de referência
        const agora = new Date();
        const mesReferencia = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

        // Criar foto na galeria
        const foto = new Foto({
          url: fotoUrl,
          descricao: `Foto de ${animalAtual.nome}`,
          animaisIds: [req.params.id],
          adicionadaPor: req.user._id,
          mesReferencia,
          emailEnviado: false
        });

        await foto.save();
        console.log('✅ Foto adicionada à galeria:', foto._id);

        // Atualizar dados com a nova foto
        updateData.fotoPerfilId = foto._id;
        updateData.fotoUrl = fotoUrl;
      }

      const animal = await Animal.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('fotoPerfilId');

      console.log('✅ Animal atualizado com sucesso:', animal._id);

      res.json({
        message: 'Animal atualizado com sucesso',
        animal
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar animal:', error);
      res.status(500).json({
        error: 'Erro ao atualizar animal',
        detalhes: error.message
      });
    }
  }
);

// PUT - Atualizar foto de perfil do animal (admin)
router.put('/:id/foto-perfil',
  verifyToken,
  isAdmin,
  checkPermission(PERMISSOES.GERENCIAR_ANIMAIS),
  async (req, res) => {
    try {
      const { fotoId } = req.body;

      // Verificar se a foto existe e está associada ao animal
      const foto = await Foto.findById(fotoId);
      if (!foto) {
        return res.status(404).json({ error: 'Foto não encontrada' });
      }

      if (!foto.animaisIds.includes(req.params.id)) {
        return res.status(400).json({
          error: 'Esta foto não está associada a este animal'
        });
      }

      const animal = await Animal.findByIdAndUpdate(
        req.params.id,
        {
          fotoPerfilId: fotoId,
          fotoUrl: foto.url
        },
        { new: true }
      ).populate('fotoPerfilId');

      if (!animal) {
        return res.status(404).json({ error: 'Animal não encontrado' });
      }

      res.json({
        message: 'Foto de perfil atualizada com sucesso',
        animal
      });
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar foto de perfil' });
    }
  }
);

// DELETE - Deletar animal (admin)
router.delete('/:id',
  verifyToken,
  isAdmin,
  checkPermission(PERMISSOES.GERENCIAR_ANIMAIS),
  async (req, res) => {
    try {
      const animal = await Animal.findByIdAndDelete(req.params.id);

      if (!animal) {
        return res.status(404).json({ error: 'Animal não encontrado' });
      }

      res.json({ message: 'Animal deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar animal:', error);
      res.status(500).json({ error: 'Erro ao deletar animal' });
    }
  }
);

export default router;
