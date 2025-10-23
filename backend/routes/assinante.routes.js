import express from 'express';
import User from '../models/user.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';

const router = express.Router();

// GET - Listar assinantes/apoiadores (admin)
router.get('/',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.VISUALIZAR_ASSINANTES),
    async (req, res) => {
        try {
            const { status, limit = 50, skip = 0, ordenarPor = 'dataCriacao' } = req.query;

            let query = { isDoador: true };

            if (status === 'ativa') {
                query['assinaturaAtiva.status'] = 'ativa';
            } else if (status === 'cancelada') {
                query['assinaturaAtiva.status'] = 'cancelada';
            }

            const sortOptions = {};
            if (ordenarPor === 'dataCriacao') {
                sortOptions.dataCriacao = -1;
            } else if (ordenarPor === 'nome') {
                sortOptions.nome = 1;
            } else if (ordenarPor === 'totalMesesApoio') {
                sortOptions.totalMesesApoio = -1;
            }

            const assinantes = await User.find(query)
                .select('nome email telefone cpf isDoador assinaturaAtiva totalMesesApoio brindesDisponiveis dataCriacao historicoPagamentos')
                .sort(sortOptions)
                .limit(parseInt(limit))
                .skip(parseInt(skip));

            const total = await User.countDocuments(query);

            res.json({
                assinantes,
                total,
                hasMore: total > (parseInt(skip) + assinantes.length)
            });
        } catch (error) {
            console.error('Erro ao buscar assinantes:', error);
            res.status(500).json({ error: 'Erro ao buscar assinantes' });
        }
    }
);

// GET - Buscar assinante por ID (admin)
router.get('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.VISUALIZAR_ASSINANTES),
    async (req, res) => {
        try {
            const assinante = await User.findById(req.params.id)
                .select('-senha');

            if (!assinante) {
                return res.status(404).json({ error: 'Assinante não encontrado' });
            }

            res.json(assinante);
        } catch (error) {
            console.error('Erro ao buscar assinante:', error);
            res.status(500).json({ error: 'Erro ao buscar assinante' });
        }
    }
);

// GET - Estatísticas de apoiadores (admin)
router.get('/stats/geral',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.VISUALIZAR_ASSINANTES),
    async (req, res) => {
        try {
            // Total de apoiadores ativos
            const totalApoiadoresAtivos = await User.countDocuments({
                isDoador: true,
                'assinaturaAtiva.status': 'ativa'
            });

            // Total de apoiadores (incluindo inativos)
            const totalApoiadores = await User.countDocuments({ isDoador: true });

            // Apoiadores cancelados
            const apoiadoresCancelados = await User.countDocuments({
                'assinaturaAtiva.status': 'cancelada'
            });

            // Novos apoiadores no mês atual
            const inicioMesAtual = new Date();
            inicioMesAtual.setDate(1);
            inicioMesAtual.setHours(0, 0, 0, 0);

            const novosMesAtual = await User.countDocuments({
                isDoador: true,
                'assinaturaAtiva.dataInicio': { $gte: inicioMesAtual }
            });

            // Novos apoiadores por mês (últimos 12 meses)
            const novosPorMes = await User.aggregate([
                {
                    $match: {
                        isDoador: true,
                        'assinaturaAtiva.dataInicio': {
                            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            ano: { $year: '$assinaturaAtiva.dataInicio' },
                            mes: { $month: '$assinaturaAtiva.dataInicio' }
                        },
                        total: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id.ano': 1, '_id.mes': 1 }
                }
            ]);

            // Novos apoiadores por ano
            const novosPorAno = await User.aggregate([
                {
                    $match: {
                        isDoador: true
                    }
                },
                {
                    $group: {
                        _id: { $year: '$assinaturaAtiva.dataInicio' },
                        total: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id': 1 }
                }
            ]);

            // Receita total estimada (baseado em pagamentos aprovados)
            const receitaTotal = await User.aggregate([
                {
                    $match: { isDoador: true }
                },
                {
                    $unwind: '$historicoPagamentos'
                },
                {
                    $match: { 'historicoPagamentos.status': 'aprovado' }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$historicoPagamentos.valor' }
                    }
                }
            ]);

            res.json({
                totalApoiadoresAtivos,
                totalApoiadores,
                apoiadoresCancelados,
                novosMesAtual,
                novosPorMes: novosPorMes.map(item => ({
                    mes: `${item._id.ano}-${String(item._id.mes).padStart(2, '0')}`,
                    total: item.total
                })),
                novosPorAno: novosPorAno.map(item => ({
                    ano: item._id,
                    total: item.total
                })),
                receitaTotal: receitaTotal.length > 0 ? receitaTotal[0].total : 0
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
    }
);

// GET - Apoiadores por dia específico (admin)
router.get('/stats/por-dia',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.VISUALIZAR_ASSINANTES),
    async (req, res) => {
        try {
            const { data } = req.query;

            if (!data) {
                return res.status(400).json({ error: 'Parâmetro "data" é obrigatório (formato: YYYY-MM-DD)' });
            }

            const dataInicio = new Date(data);
            dataInicio.setHours(0, 0, 0, 0);

            const dataFim = new Date(data);
            dataFim.setHours(23, 59, 59, 999);

            const apoiadoresDia = await User.find({
                isDoador: true,
                'assinaturaAtiva.dataInicio': {
                    $gte: dataInicio,
                    $lte: dataFim
                }
            }).select('nome email assinaturaAtiva.dataInicio assinaturaAtiva.valorMensal');

            res.json({
                data,
                total: apoiadoresDia.length,
                apoiadores: apoiadoresDia
            });
        } catch (error) {
            console.error('Erro ao buscar apoiadores por dia:', error);
            res.status(500).json({ error: 'Erro ao buscar apoiadores por dia' });
        }
    }
);

export default router;
