import express from 'express';
import ConfiguracaoResgate from '../models/configuracao-resgate.model.js';
import SolicitacaoResgate from '../models/solicitacao-resgate.model.js';
import Brinde from '../models/brinde.model.js';
import User from '../models/user.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';
import { enviarEmailSolicitacaoResgate } from '../services/email.service.js';

const router = express.Router();

// GET - Buscar configuração de resgate (público)
router.get('/configuracao', async (req, res) => {
    try {
        const config = await ConfiguracaoResgate.getConfig();
        res.json(config);
    } catch (error) {
        console.error('Erro ao buscar configuração:', error);
        res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
});

// PUT - Atualizar configuração de resgate (admin)
router.put('/configuracao',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_CONFIGURACOES),
    async (req, res) => {
        try {
            const { diasSemana, horariosDisponiveis, intervaloMinutos, mensagemInformativa, ativo } = req.body;

            let config = await ConfiguracaoResgate.findOne();

            if (!config) {
                config = new ConfiguracaoResgate();
            }

            if (diasSemana !== undefined) config.diasSemana = diasSemana;
            if (horariosDisponiveis !== undefined) config.horariosDisponiveis = horariosDisponiveis;
            if (intervaloMinutos !== undefined) config.intervaloMinutos = intervaloMinutos;
            if (mensagemInformativa !== undefined) config.mensagemInformativa = mensagemInformativa;
            if (ativo !== undefined) config.ativo = ativo;

            await config.save();

            res.json({
                message: 'Configuração atualizada com sucesso',
                config
            });
        } catch (error) {
            console.error('Erro ao atualizar configuração:', error);
            res.status(500).json({ error: 'Erro ao atualizar configuração' });
        }
    }
);

// GET - Listar solicitações de resgate (admin ou próprias)
router.get('/solicitacoes', verifyToken, async (req, res) => {
    try {
        const { status, dataInicio, dataFim } = req.query;

        let query = {};

        // Se não for admin, mostrar apenas as próprias solicitações
        if (!req.user.isAdmin) {
            query.usuarioId = req.user._id;
        }

        if (status) {
            query.status = status;
        }

        if (dataInicio || dataFim) {
            query.dataHorarioEscolhido = {};
            if (dataInicio) {
                query.dataHorarioEscolhido.$gte = new Date(dataInicio);
            }
            if (dataFim) {
                query.dataHorarioEscolhido.$lte = new Date(dataFim);
            }
        }

        const solicitacoes = await SolicitacaoResgate.find(query)
            .populate('usuarioId', 'nome email telefone')
            .populate('brindeId', 'nome descricao fotoUrl')
            .sort({ criadoEm: -1 });

        res.json({ solicitacoes });
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
        res.status(500).json({ error: 'Erro ao buscar solicitações' });
    }
});

// POST - Criar solicitação de resgate (usuário autenticado)
router.post('/solicitacoes', verifyToken, async (req, res) => {
    try {
        const { brindeId, dataHorarioEscolhido, observacoes } = req.body;

        // Verificar se o usuário é doador
        const usuario = await User.findById(req.user._id);
        if (!usuario.isDoador) {
            return res.status(403).json({
                error: 'Apenas apoiadores podem solicitar brindes'
            });
        }

        // Verificar se o brinde existe e está disponível
        const brinde = await Brinde.findById(brindeId);
        if (!brinde) {
            return res.status(404).json({ error: 'Brinde não encontrado' });
        }
        if (!brinde.disponivelParaResgate) {
            return res.status(400).json({ error: 'Este brinde não está disponível para resgate' });
        }

        // Verificar se o horário está disponível
        const dataEscolhida = new Date(dataHorarioEscolhido);
        const config = await ConfiguracaoResgate.getConfig();

        if (!config.ativo) {
            return res.status(400).json({ error: 'Sistema de resgates temporariamente desativado' });
        }

        // Verificar se já existe solicitação para este horário
        const solicitacaoExistente = await SolicitacaoResgate.findOne({
            dataHorarioEscolhido: dataEscolhida,
            status: { $in: ['pendente', 'confirmado'] }
        });

        if (solicitacaoExistente) {
            return res.status(400).json({ error: 'Este horário já está reservado' });
        }

        const solicitacao = new SolicitacaoResgate({
            usuarioId: req.user._id,
            brindeId,
            dataHorarioEscolhido: dataEscolhida,
            observacoes
        });

        await solicitacao.save();

        // Enviar email para o admin
        try {
            await enviarEmailSolicitacaoResgate(solicitacao);
            solicitacao.emailEnviado = true;
            await solicitacao.save();
        } catch (emailError) {
            console.error('Erro ao enviar email:', emailError);
        }

        // Popular dados antes de retornar
        await solicitacao.populate('usuarioId', 'nome email telefone');
        await solicitacao.populate('brindeId', 'nome descricao fotoUrl');

        res.status(201).json({
            message: 'Solicitação criada com sucesso',
            solicitacao
        });
    } catch (error) {
        console.error('Erro ao criar solicitação:', error);
        res.status(500).json({ error: 'Erro ao criar solicitação' });
    }
});

// PUT - Atualizar status de solicitação (admin)
router.put('/solicitacoes/:id',
    verifyToken,
    isAdmin,
    async (req, res) => {
        try {
            const { status, observacoes } = req.body;

            const solicitacao = await SolicitacaoResgate.findByIdAndUpdate(
                req.params.id,
                { status, observacoes },
                { new: true }
            )
                .populate('usuarioId', 'nome email telefone')
                .populate('brindeId', 'nome descricao fotoUrl');

            if (!solicitacao) {
                return res.status(404).json({ error: 'Solicitação não encontrada' });
            }

            res.json({
                message: 'Solicitação atualizada com sucesso',
                solicitacao
            });
        } catch (error) {
            console.error('Erro ao atualizar solicitação:', error);
            res.status(500).json({ error: 'Erro ao atualizar solicitação' });
        }
    }
);

// DELETE - Cancelar solicitação (usuário ou admin)
router.delete('/solicitacoes/:id', verifyToken, async (req, res) => {
    try {
        const solicitacao = await SolicitacaoResgate.findById(req.params.id);

        if (!solicitacao) {
            return res.status(404).json({ error: 'Solicitação não encontrada' });
        }

        // Verificar se o usuário pode cancelar
        if (!req.user.isAdmin && solicitacao.usuarioId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Você não pode cancelar esta solicitação' });
        }

        solicitacao.status = 'cancelado';
        await solicitacao.save();

        res.json({ message: 'Solicitação cancelada com sucesso' });
    } catch (error) {
        console.error('Erro ao cancelar solicitação:', error);
        res.status(500).json({ error: 'Erro ao cancelar solicitação' });
    }
});

export default router;
