import express from 'express';
import mongoose from 'mongoose';
import Foto from '../models/foto.model.js';
import Animal from '../models/animal.model.js';
import User from '../models/user.model.js';
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

// GET - Galeria pessoal do usuário (baseada nos meses de apoio)
router.get('/galeria/minhas-fotos', verifyToken, async (req, res) => {
    try {
        const { limit = 50, skip = 0 } = req.query;
        const userId = req.user._id;

        // Buscar usuário com seus pagamentos
        const user = await User.findById(userId).select('historicoPagamentos');

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Obter meses únicos em que o usuário apoiou (com pagamento aprovado)
        const mesesApoio = new Set();
        user.historicoPagamentos
            .filter(p => p.status === 'aprovado' && p.mesReferencia)
            .forEach(p => mesesApoio.add(p.mesReferencia));

        console.log(`📅 Usuário ${userId} apoiou nos meses:`, Array.from(mesesApoio));

        if (mesesApoio.size === 0) {
            return res.json({
                fotos: [],
                total: 0,
                hasMore: false,
                message: 'Você ainda não possui meses de apoio. Faça uma contribuição para ter acesso à galeria!'
            });
        }

        // Buscar fotos dos meses em que o usuário apoiou
        const query = {
            mesReferencia: { $in: Array.from(mesesApoio) }
        };

        const fotos = await Foto.find(query)
            .populate('animaisIds', 'nome tipo')
            .populate('adicionadaPor', 'nome email')
            .sort({ criadaEm: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Foto.countDocuments(query);

        console.log(`✅ ${total} fotos disponíveis para o usuário`);

        res.json({
            fotos,
            total,
            hasMore: total > (parseInt(skip) + fotos.length),
            mesesApoio: Array.from(mesesApoio).sort().reverse() // Retorna os meses em ordem decrescente
        });
    } catch (error) {
        console.error('❌ Erro ao buscar galeria pessoal:', error);
        res.status(500).json({ error: 'Erro ao buscar galeria pessoal' });
    }
});

// GET - Estatísticas da galeria pessoal do usuário
router.get('/galeria/estatisticas', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Buscar usuário com seus pagamentos
        const user = await User.findById(userId).select('historicoPagamentos totalMesesApoio');

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Obter meses únicos em que o usuário apoiou
        const mesesApoio = new Set();
        user.historicoPagamentos
            .filter(p => p.status === 'aprovado' && p.mesReferencia)
            .forEach(p => mesesApoio.add(p.mesReferencia));

        const mesesArray = Array.from(mesesApoio).sort();

        // Contar fotos por mês
        const fotosPorMes = await Promise.all(
            mesesArray.map(async (mes) => {
                const count = await Foto.countDocuments({ mesReferencia: mes });
                return { mes, quantidade: count };
            })
        );

        // Total de fotos disponíveis
        const totalFotos = await Foto.countDocuments({
            mesReferencia: { $in: mesesArray }
        });

        res.json({
            totalMesesApoio: user.totalMesesApoio,
            mesesComAcesso: mesesArray,
            totalFotosDisponiveis: totalFotos,
            fotosPorMes: fotosPorMes.reverse() // Mais recentes primeiro
        });
    } catch (error) {
        console.error('❌ Erro ao buscar estatísticas da galeria:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
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
            console.log('📸 Upload batch - Arquivos recebidos:', req.files?.length);
            console.log('📝 Body recebido:', Object.keys(req.body));

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'Nenhuma foto foi enviada' });
            }

            const { descricoes, animaisIds, enviarEmail } = req.body;

            // Parse JSON strings se necessário
            const descricoesArray = typeof descricoes === 'string' ? JSON.parse(descricoes) : descricoes;
            const animaisIdsArray = typeof animaisIds === 'string' ? JSON.parse(animaisIds) : animaisIds;

            console.log('📋 Descrições:', descricoesArray);
            console.log('🐾 Animais IDs:', animaisIdsArray);

            if (!Array.isArray(animaisIdsArray)) {
                console.error('❌ animaisIdsArray não é um array:', animaisIdsArray);
                return res.status(400).json({
                    error: 'Formato inválido para animaisIds',
                    detalhes: 'Esperado um array de arrays'
                });
            }

            const fotosCriadas = [];

            // Calcular mês de referência atual (quando a foto está sendo adicionada)
            const agora = new Date();
            const mesReferencia = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const url = `/uploads/fotos/${file.filename}`;
                const descricao = descricoesArray?.[i] || '';
                const animaisParaFoto = animaisIdsArray?.[i] || [];

                console.log(`📷 Processando foto ${i + 1}/${req.files.length}:`, {
                    filename: file.filename,
                    descricao,
                    animaisParaFoto
                });

                // Filtrar IDs vazios ou inválidos usando validação correta do MongoDB
                const animaisIdsValidos = Array.isArray(animaisParaFoto)
                    ? animaisParaFoto.filter(id => {
                        if (!id) return false;
                        // Usar validação do mongoose ao invés de apenas checar comprimento
                        const isValid = mongoose.Types.ObjectId.isValid(id);
                        if (!isValid) {
                            console.warn(`⚠️ ID inválido ignorado: ${id}`);
                        }
                        return isValid;
                    })
                    : [];

                console.log(`✅ IDs válidos para foto ${i + 1}:`, animaisIdsValidos);

                const foto = new Foto({
                    url,
                    descricao,
                    animaisIds: animaisIdsValidos,
                    adicionadaPor: req.user._id,
                    mesReferencia // Adiciona o mês de referência
                });

                await foto.save();
                console.log(`💾 Foto ${i + 1} salva com ID:`, foto._id);
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
            console.error('❌ Erro ao fazer upload de fotos:', error);
            console.error('📍 Stack:', error.stack);
            res.status(500).json({
                error: 'Erro ao fazer upload de fotos',
                detalhes: error.message
            });
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
