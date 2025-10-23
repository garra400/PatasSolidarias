import express from 'express';
import ConviteAdmin from '../models/convite-admin.model.js';
import User from '../models/user.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';
import { enviarConviteAdmin } from '../services/email.service.js';
import crypto from 'crypto';

const router = express.Router();

// GET - Verificar se usuário é admin
router.get('/check', verifyToken, async (req, res) => {
    try {
        res.json({
            isAdmin: req.user.isAdmin || false,
            permissoes: req.user.permissoes || {}
        });
    } catch (error) {
        console.error('Erro ao verificar admin:', error);
        res.status(500).json({ error: 'Erro ao verificar admin' });
    }
});

// GET - Listar convites (admin)
router.get('/convites',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.CONVIDAR_ADMINS),
    async (req, res) => {
        try {
            const { status } = req.query;

            let query = {};
            if (status) {
                query.status = status;
            }

            const convites = await ConviteAdmin.find(query)
                .populate('convidadoPor', 'nome email')
                .populate('usuarioId', 'nome email')
                .sort({ criadoEm: -1 });

            res.json({ convites });
        } catch (error) {
            console.error('Erro ao buscar convites:', error);
            res.status(500).json({ error: 'Erro ao buscar convites' });
        }
    }
);

// POST - Criar convite admin
router.post('/convites',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.CONVIDAR_ADMINS),
    async (req, res) => {
        try {
            const { emailConvidado, permissoes } = req.body;

            // Verificar se o email existe no sistema
            const usuario = await User.findOne({ email: emailConvidado.toLowerCase() });

            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado. O email deve estar registrado no sistema.'
                });
            }

            if (usuario.isAdmin) {
                return res.status(400).json({
                    error: 'Este usuário já é administrador'
                });
            }

            // Verificar se já existe convite pendente
            const convitePendente = await ConviteAdmin.findOne({
                emailConvidado: emailConvidado.toLowerCase(),
                status: 'pendente',
                dataExpiracao: { $gt: new Date() }
            });

            if (convitePendente) {
                return res.status(400).json({
                    error: 'Já existe um convite pendente para este email'
                });
            }

            // Criar token único
            const token = crypto.randomBytes(32).toString('hex');

            // Data de expiração: 7 dias
            const dataExpiracao = new Date();
            dataExpiracao.setDate(dataExpiracao.getDate() + 7);

            const convite = new ConviteAdmin({
                emailConvidado: emailConvidado.toLowerCase(),
                usuarioId: usuario._id,
                token,
                convidadoPor: req.user._id,
                permissoes: permissoes || {
                    gerenciarAnimais: true,
                    gerenciarFotos: true,
                    gerenciarBrindes: true,
                    gerenciarPosts: true,
                    visualizarAssinantes: true,
                    convidarAdmins: false,
                    gerenciarConfiguracoes: false
                },
                dataExpiracao
            });

            await convite.save();

            // Enviar email
            try {
                await enviarConviteAdmin(convite, req.user);
            } catch (emailError) {
                console.error('Erro ao enviar email de convite:', emailError);
                // Não falhar a requisição
            }

            await convite.populate('convidadoPor', 'nome email');

            res.status(201).json({
                message: 'Convite criado e enviado com sucesso',
                convite
            });
        } catch (error) {
            console.error('Erro ao criar convite:', error);
            res.status(500).json({ error: 'Erro ao criar convite' });
        }
    }
);

// GET - Verificar convite por token (público)
router.get('/convites/verificar/:token', async (req, res) => {
    try {
        const convite = await ConviteAdmin.findOne({ token: req.params.token })
            .populate('convidadoPor', 'nome email');

        if (!convite) {
            return res.status(404).json({ error: 'Convite não encontrado' });
        }

        if (!convite.isValido()) {
            return res.status(400).json({ error: 'Convite expirado ou já utilizado' });
        }

        res.json({
            convite: {
                emailConvidado: convite.emailConvidado,
                convidadoPor: convite.convidadoPor,
                permissoes: convite.permissoes,
                dataExpiracao: convite.dataExpiracao
            }
        });
    } catch (error) {
        console.error('Erro ao verificar convite:', error);
        res.status(500).json({ error: 'Erro ao verificar convite' });
    }
});

// POST - Aceitar convite (usuário autenticado)
router.post('/convites/aceitar/:token', verifyToken, async (req, res) => {
    try {
        const convite = await ConviteAdmin.findOne({ token: req.params.token });

        if (!convite) {
            return res.status(404).json({ error: 'Convite não encontrado' });
        }

        if (!convite.isValido()) {
            return res.status(400).json({ error: 'Convite expirado ou já utilizado' });
        }

        // Verificar se o email do convite corresponde ao usuário logado
        if (convite.emailConvidado !== req.user.email.toLowerCase()) {
            return res.status(403).json({
                error: 'Este convite não foi enviado para você'
            });
        }

        // Atualizar usuário para admin
        const usuario = await User.findById(req.user._id);
        usuario.isAdmin = true;
        usuario.permissoes = convite.permissoes;
        await usuario.save();

        // Atualizar convite
        convite.status = 'aceito';
        convite.dataAceite = new Date();
        await convite.save();

        res.json({
            message: 'Convite aceito com sucesso! Você agora é um administrador.',
            permissoes: usuario.permissoes
        });
    } catch (error) {
        console.error('Erro ao aceitar convite:', error);
        res.status(500).json({ error: 'Erro ao aceitar convite' });
    }
});

// DELETE - Cancelar convite (admin)
router.delete('/convites/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.CONVIDAR_ADMINS),
    async (req, res) => {
        try {
            const convite = await ConviteAdmin.findById(req.params.id);

            if (!convite) {
                return res.status(404).json({ error: 'Convite não encontrado' });
            }

            convite.status = 'cancelado';
            await convite.save();

            res.json({ message: 'Convite cancelado com sucesso' });
        } catch (error) {
            console.error('Erro ao cancelar convite:', error);
            res.status(500).json({ error: 'Erro ao cancelar convite' });
        }
    }
);

// GET - Listar admins (admin)
router.get('/lista',
    verifyToken,
    isAdmin,
    async (req, res) => {
        try {
            const admins = await User.find({ isAdmin: true })
                .select('nome email permissoes dataCriacao')
                .sort({ dataCriacao: -1 });

            res.json({ admins });
        } catch (error) {
            console.error('Erro ao buscar admins:', error);
            res.status(500).json({ error: 'Erro ao buscar admins' });
        }
    }
);

// PUT - Atualizar permissões de admin (admin com permissão)
router.put('/permissoes/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.CONVIDAR_ADMINS),
    async (req, res) => {
        try {
            const { permissoes } = req.body;

            const admin = await User.findById(req.params.id);

            if (!admin || !admin.isAdmin) {
                return res.status(404).json({ error: 'Admin não encontrado' });
            }

            admin.permissoes = { ...admin.permissoes, ...permissoes };
            await admin.save();

            res.json({
                message: 'Permissões atualizadas com sucesso',
                admin: {
                    nome: admin.nome,
                    email: admin.email,
                    permissoes: admin.permissoes
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar permissões:', error);
            res.status(500).json({ error: 'Erro ao atualizar permissões' });
        }
    }
);

// DELETE - Remover admin (admin com permissão)
router.delete('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.CONVIDAR_ADMINS),
    async (req, res) => {
        try {
            // Não permitir remover a si mesmo
            if (req.params.id === req.user._id.toString()) {
                return res.status(400).json({ error: 'Você não pode remover seu próprio acesso admin' });
            }

            const admin = await User.findById(req.params.id);

            if (!admin || !admin.isAdmin) {
                return res.status(404).json({ error: 'Admin não encontrado' });
            }

            admin.isAdmin = false;
            admin.permissoes = {};
            await admin.save();

            res.json({ message: 'Acesso admin removido com sucesso' });
        } catch (error) {
            console.error('Erro ao remover admin:', error);
            res.status(500).json({ error: 'Erro ao remover admin' });
        }
    }
);

export default router;
