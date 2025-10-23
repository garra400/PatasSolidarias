import express from 'express';
import Brinde from '../models/brinde.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';
import { enviarEmailBrindesAtualizados } from '../services/email.service.js';

const router = express.Router();

// GET - Listar todos os brindes (público)
router.get('/', async (req, res) => {
    try {
        const { disponiveis, limit } = req.query;

        let query = {};
        if (disponiveis === 'true') {
            query.disponivelParaResgate = true;
        }

        let queryBuilder = Brinde.find(query).sort({ ordem: 1, criadoEm: -1 });

        if (limit) {
            queryBuilder = queryBuilder.limit(parseInt(limit));
        }

        const brindes = await queryBuilder;
        const total = await Brinde.countDocuments(query);

        res.json({ brindes, total });
    } catch (error) {
        console.error('Erro ao buscar brindes:', error);
        res.status(500).json({ error: 'Erro ao buscar brindes' });
    }
});

// GET - Buscar brinde por ID
router.get('/:id', async (req, res) => {
    try {
        const brinde = await Brinde.findById(req.params.id);

        if (!brinde) {
            return res.status(404).json({ error: 'Brinde não encontrado' });
        }

        res.json(brinde);
    } catch (error) {
        console.error('Erro ao buscar brinde:', error);
        res.status(500).json({ error: 'Erro ao buscar brinde' });
    }
});

// POST - Criar brinde (admin)
router.post('/',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_BRINDES),
    uploadSingle,
    async (req, res) => {
        try {
            const { nome, descricao, disponivelParaResgate, ordem } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: 'Foto do brinde é obrigatória' });
            }

            const fotoUrl = `/uploads/brindes/${req.file.filename}`;

            const brinde = new Brinde({
                nome,
                descricao,
                fotoUrl,
                disponivelParaResgate: disponivelParaResgate === 'true' || disponivelParaResgate === true,
                ordem: parseInt(ordem) || 0
            });

            await brinde.save();

            res.status(201).json({
                message: 'Brinde criado com sucesso',
                brinde
            });
        } catch (error) {
            console.error('Erro ao criar brinde:', error);
            res.status(500).json({ error: 'Erro ao criar brinde' });
        }
    }
);

// PUT - Atualizar brinde (admin)
router.put('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_BRINDES),
    uploadSingle,
    async (req, res) => {
        try {
            const { nome, descricao, disponivelParaResgate, ordem } = req.body;

            const updateData = {
                nome,
                descricao,
                disponivelParaResgate: disponivelParaResgate === 'true' || disponivelParaResgate === true,
                ordem: parseInt(ordem) || 0
            };

            // Se uma nova foto foi enviada
            if (req.file) {
                updateData.fotoUrl = `/uploads/brindes/${req.file.filename}`;
            }

            const brinde = await Brinde.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!brinde) {
                return res.status(404).json({ error: 'Brinde não encontrado' });
            }

            res.json({
                message: 'Brinde atualizado com sucesso',
                brinde
            });
        } catch (error) {
            console.error('Erro ao atualizar brinde:', error);
            res.status(500).json({ error: 'Erro ao atualizar brinde' });
        }
    }
);

// PUT - Atualizar disponibilidade em lote (admin)
router.put('/batch/disponibilidade',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_BRINDES),
    async (req, res) => {
        try {
            const { brindesIds, enviarEmail } = req.body;

            if (!Array.isArray(brindesIds) || brindesIds.length === 0) {
                return res.status(400).json({ error: 'IDs dos brindes são obrigatórios' });
            }

            // Atualizar: marcar apenas os IDs enviados como disponíveis
            await Brinde.updateMany(
                {},
                { disponivelParaResgate: false }
            );

            await Brinde.updateMany(
                { _id: { $in: brindesIds } },
                { disponivelParaResgate: true }
            );

            // Enviar email se solicitado
            if (enviarEmail) {
                const brindesDisponiveis = await Brinde.find({
                    _id: { $in: brindesIds }
                });

                try {
                    await enviarEmailBrindesAtualizados(brindesDisponiveis);
                } catch (emailError) {
                    console.error('Erro ao enviar email:', emailError);
                }
            }

            const brindesAtualizados = await Brinde.find({}).sort({ ordem: 1 });

            res.json({
                message: 'Disponibilidade atualizada com sucesso',
                brindes: brindesAtualizados
            });
        } catch (error) {
            console.error('Erro ao atualizar disponibilidade:', error);
            res.status(500).json({ error: 'Erro ao atualizar disponibilidade' });
        }
    }
);

// DELETE - Deletar brinde (admin)
router.delete('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_BRINDES),
    async (req, res) => {
        try {
            const brinde = await Brinde.findByIdAndDelete(req.params.id);

            if (!brinde) {
                return res.status(404).json({ error: 'Brinde não encontrado' });
            }

            res.json({ message: 'Brinde deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar brinde:', error);
            res.status(500).json({ error: 'Erro ao deletar brinde' });
        }
    }
);

export default router;
