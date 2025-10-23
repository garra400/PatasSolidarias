import express from 'express';
import Post from '../models/post.model.js';
import EmailPost from '../models/email-post.model.js';
import User from '../models/user.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin, checkPermission, PERMISSOES } from '../middleware/admin.middleware.js';
import { enviarNewsletter } from '../services/email.service.js';
import crypto from 'crypto';

const router = express.Router();

// GET - Listar posts (admin vê todos, usuário vê apenas enviados)
router.get('/', async (req, res) => {
    try {
        const { status, limit = 20, skip = 0 } = req.query;

        let query = {};

        // Se não for admin, mostrar apenas posts enviados
        if (!req.headers.authorization) {
            query.status = 'enviado';
        } else {
            if (status) {
                query.status = status;
            }
        }

        const posts = await Post.find(query)
            .populate('criadoPor', 'nome email')
            .populate('imagensAnimais', 'nome fotoUrl')
            .populate('imagensBrindes', 'nome fotoUrl')
            .sort({ criadoEm: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Post.countDocuments(query);

        res.json({
            posts,
            total,
            hasMore: total > (parseInt(skip) + posts.length)
        });
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).json({ error: 'Erro ao buscar posts' });
    }
});

// GET - Buscar post por ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('criadoPor', 'nome email')
            .populate('imagensAnimais', 'nome fotoUrl')
            .populate('imagensBrindes', 'nome fotoUrl');

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Se não for enviado e não for admin, negar acesso
        if (post.status !== 'enviado' && !req.headers.authorization) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json(post);
    } catch (error) {
        console.error('Erro ao buscar post:', error);
        res.status(500).json({ error: 'Erro ao buscar post' });
    }
});

// POST - Criar post (admin)
router.post('/',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_POSTS),
    async (req, res) => {
        try {
            const { titulo, conteudoHtml, imagensAnimais, imagensBrindes, destinatarios } = req.body;

            const post = new Post({
                titulo,
                conteudoHtml,
                imagensAnimais: imagensAnimais || [],
                imagensBrindes: imagensBrindes || [],
                destinatarios: destinatarios || 'todos',
                criadoPor: req.user._id,
                status: 'rascunho'
            });

            await post.save();

            await post.populate('criadoPor', 'nome email');
            await post.populate('imagensAnimais', 'nome fotoUrl');
            await post.populate('imagensBrindes', 'nome fotoUrl');

            res.status(201).json({
                message: 'Post criado com sucesso',
                post
            });
        } catch (error) {
            console.error('Erro ao criar post:', error);
            res.status(500).json({ error: 'Erro ao criar post' });
        }
    }
);

// PUT - Atualizar post (admin)
router.put('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_POSTS),
    async (req, res) => {
        try {
            const { titulo, conteudoHtml, imagensAnimais, imagensBrindes, destinatarios } = req.body;

            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            // Não permitir editar post já enviado
            if (post.status === 'enviado') {
                return res.status(400).json({ error: 'Não é possível editar um post já enviado' });
            }

            post.titulo = titulo;
            post.conteudoHtml = conteudoHtml;
            post.imagensAnimais = imagensAnimais || [];
            post.imagensBrindes = imagensBrindes || [];
            post.destinatarios = destinatarios || post.destinatarios;

            await post.save();

            await post.populate('criadoPor', 'nome email');
            await post.populate('imagensAnimais', 'nome fotoUrl');
            await post.populate('imagensBrindes', 'nome fotoUrl');

            res.json({
                message: 'Post atualizado com sucesso',
                post
            });
        } catch (error) {
            console.error('Erro ao atualizar post:', error);
            res.status(500).json({ error: 'Erro ao atualizar post' });
        }
    }
);

// POST - Enviar post (admin)
router.post('/:id/enviar',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_POSTS),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate('imagensAnimais', 'nome fotoUrl')
                .populate('imagensBrindes', 'nome fotoUrl');

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            if (post.status === 'enviado') {
                return res.status(400).json({ error: 'Este post já foi enviado' });
            }

            // Buscar destinatários
            let query = { emailVerificado: true };
            if (post.destinatarios === 'apoiadores') {
                query.isDoador = true;
            }

            const usuarios = await User.find(query).select('_id email nome');

            if (usuarios.length === 0) {
                return res.status(400).json({ error: 'Nenhum destinatário encontrado' });
            }

            // Criar registros de email
            const emailsPost = [];
            for (const usuario of usuarios) {
                const token = crypto.randomBytes(32).toString('hex');
                emailsPost.push({
                    postId: post._id,
                    usuarioId: usuario._id,
                    emailUsuario: usuario.email,
                    token
                });
            }

            await EmailPost.insertMany(emailsPost);

            // Enviar emails
            try {
                await enviarNewsletter(post, usuarios, emailsPost);
            } catch (emailError) {
                console.error('Erro ao enviar emails:', emailError);
                return res.status(500).json({ error: 'Erro ao enviar emails' });
            }

            // Atualizar post
            post.status = 'enviado';
            post.dataEnvio = new Date();
            post.totalDestinatarios = usuarios.length;
            await post.save();

            res.json({
                message: `Post enviado com sucesso para ${usuarios.length} destinatário(s)`,
                post
            });
        } catch (error) {
            console.error('Erro ao enviar post:', error);
            res.status(500).json({ error: 'Erro ao enviar post' });
        }
    }
);

// GET - Tracking de abertura de email
router.get('/track/:token', async (req, res) => {
    try {
        const emailPost = await EmailPost.findOne({ token: req.params.token });

        if (emailPost && !emailPost.aberto) {
            emailPost.aberto = true;
            emailPost.dataAbertura = new Date();
            await emailPost.save();

            // Atualizar contador no post
            await Post.findByIdAndUpdate(emailPost.postId, {
                $inc: { totalAbertos: 1 }
            });
        }

        // Retornar pixel transparente 1x1
        const pixel = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64'
        );

        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': pixel.length,
            'Cache-Control': 'no-store, no-cache, must-revalidate, private'
        });
        res.end(pixel);
    } catch (error) {
        console.error('Erro no tracking:', error);
        res.status(200).end();
    }
});

// DELETE - Deletar post (admin, apenas rascunhos)
router.delete('/:id',
    verifyToken,
    isAdmin,
    checkPermission(PERMISSOES.GERENCIAR_POSTS),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            if (post.status === 'enviado') {
                return res.status(400).json({ error: 'Não é possível deletar um post já enviado' });
            }

            await post.deleteOne();

            res.json({ message: 'Post deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar post:', error);
            res.status(500).json({ error: 'Erro ao deletar post' });
        }
    }
);

export default router;
