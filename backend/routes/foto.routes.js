import express from 'express';
import Foto from '../models/foto.model.js';
import Animal from '../models/animal.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';
import { uploadMultiple } from '../middleware/upload.middleware.js';
import { enviarEmailNovasFotos } from '../services/email.service.js';

const router = express.Router();

// GET - Listar todas as fotos (público)
router.get('/', async (req, res) => {
    try {
        const { animalId, limit = 50, skip = 0 } = req.query;

        let query = {};
        if (animalId) {
            query.animaisIds = animalId;
        }

        const fotos = await Foto.find(query)
            .populate('animaisIds', 'nome tipo')
            .populate('adicionadaPor', 'nome email')
            .sort({ criadaEm: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Foto.countDocuments(query);

        res.json({
            fotos,
            total,
            hasMore: total > (parseInt(skip) + fotos.length)
        });
    } catch (error) {
        console.error('Erro ao buscar fotos:', error);
        res.status(500).json({ error: 'Erro ao buscar fotos' });
    }
});

// GET - Buscar foto por ID
router.get('/:id', async (req, res) => {
    try {
        const foto = await Foto.findById(req.params.id)
            .populate('animaisIds', 'nome tipo fotoUrl')
            .populate('adicionadaPor', 'nome email');

        if (!foto) {
            return res.status(404).json({ error: 'Foto não encontrada' });
        }

        res.json(foto);
    } catch (error) {
        console.error('Erro ao buscar foto:', error);
        res.status(500).json({ error: 'Erro ao buscar foto' });
    }
});

// POST - Upload de múltiplas fotos (admin)
router.post('/batch',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_FOTOS),
    uploadMultiple,
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'Nenhuma foto foi enviada' });
            }

            const { descricoes, animaisIds, enviarEmail } = req.body;

            // Parse JSON strings se necessário
            const descricoesArray = typeof descricoes === 'string' ? JSON.parse(descricoes) : descricoes;
            const animaisIdsArray = typeof animaisIds === 'string' ? JSON.parse(animaisIds) : animaisIds;

            const fotosCriadas = [];

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const url = `/uploads/fotos/${file.filename}`;
                const descricao = descricoesArray?.[i] || '';
                const animaisParaFoto = animaisIdsArray?.[i] || [];

                const foto = new Foto({
                    url,
                    descricao,
                    animaisIds: animaisParaFoto,
                    adicionadaPor: req.user._id
                });

                await foto.save();
                fotosCriadas.push(foto);
            }

            // Enviar email se solicitado
            if (enviarEmail === 'true' || enviarEmail === true) {
                try {
                    await enviarEmailNovasFotos(fotosCriadas);

                    // Marcar fotos como email enviado
                    await Foto.updateMany(
                        { _id: { $in: fotosCriadas.map(f => f._id) } },
                        { emailEnviado: true, dataEnvioEmail: new Date() }
                    );
                } catch (emailError) {
                    console.error('Erro ao enviar email:', emailError);
                    // Não falhar a requisição por erro de email
                }
            }

            // Popular dados antes de retornar
            const fotosPopuladas = await Foto.find({
                _id: { $in: fotosCriadas.map(f => f._id) }
            })
                .populate('animaisIds', 'nome tipo')
                .populate('adicionadaPor', 'nome email');

            res.status(201).json({
                message: `${fotosCriadas.length} foto(s) adicionada(s) com sucesso`,
                fotos: fotosPopuladas
            });
        } catch (error) {
            console.error('Erro ao fazer upload de fotos:', error);
            res.status(500).json({ error: 'Erro ao fazer upload de fotos' });
        }
    }
);

// PUT - Atualizar foto (admin)
router.put('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_FOTOS),
    async (req, res) => {
        try {
            const { descricao, animaisIds } = req.body;

            const foto = await Foto.findByIdAndUpdate(
                req.params.id,
                { descricao, animaisIds },
                { new: true, runValidators: true }
            )
                .populate('animaisIds', 'nome tipo')
                .populate('adicionadaPor', 'nome email');

            if (!foto) {
                return res.status(404).json({ error: 'Foto não encontrada' });
            }

            res.json({
                message: 'Foto atualizada com sucesso',
                foto
            });
        } catch (error) {
            console.error('Erro ao atualizar foto:', error);
            res.status(500).json({ error: 'Erro ao atualizar foto' });
        }
    }
);

// DELETE - Deletar foto (admin)
router.delete('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_FOTOS),
    async (req, res) => {
        try {
            const foto = await Foto.findById(req.params.id);

            if (!foto) {
                return res.status(404).json({ error: 'Foto não encontrada' });
            }

            // Remover referência nos animais que usam esta foto como perfil
            await Animal.updateMany(
                { fotoPerfilId: foto._id },
                { $unset: { fotoPerfilId: 1 } }
            );

            await foto.deleteOne();

            res.json({ message: 'Foto deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar foto:', error);
            res.status(500).json({ error: 'Erro ao deletar foto' });
        }
    }
);

export default router;
