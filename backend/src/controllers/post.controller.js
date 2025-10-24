import Post from '../models/Post.model.js';
import User from '../models/User.model.js';
import { sendBulkEmail } from '../services/email.service.js';
import cloudinary from '../config/cloudinary.js';

export const getPosts = async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const posts = await Post.find(query)
            .populate('autor', 'nome')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: posts.length, posts });
    } catch (error) {
        next(error);
    }
};

export const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('autor', 'nome email');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post não encontrado' });
        }

        res.json({ success: true, post });
    } catch (error) {
        next(error);
    }
};

export const createPost = async (req, res, next) => {
    try {
        let imagemCapa = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'patas-solidarias/posts', width: 1200, height: 630, crop: 'limit' },
                    (error, result) => error ? reject(error) : resolve(result)
                );
                uploadStream.end(req.file.buffer);
            });
            imagemCapa = result.secure_url;
        }

        const post = await Post.create({
            ...req.body,
            imagemCapa,
            autor: req.user._id
        });

        res.status(201).json({ success: true, message: 'Post criado com sucesso', post });
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post não encontrado' });
        }

        if (req.file) {
            if (post.imagemCapa) {
                const publicId = post.imagemCapa.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'patas-solidarias/posts', width: 1200, height: 630, crop: 'limit' },
                    (error, result) => error ? reject(error) : resolve(result)
                );
                uploadStream.end(req.file.buffer);
            });
            req.body.imagemCapa = result.secure_url;
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.json({ success: true, message: 'Post atualizado com sucesso', post });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post não encontrado' });
        }

        if (post.imagemCapa) {
            const publicId = post.imagemCapa.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await post.deleteOne();

        res.json({ success: true, message: 'Post deletado com sucesso' });
    } catch (error) {
        next(error);
    }
};

export const enviarNewsletter = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post não encontrado' });
        }

        if (post.status === 'enviado') {
            return res.status(400).json({ success: false, message: 'Newsletter já foi enviada' });
        }

        // Buscar todos os doadores
        const doadores = await User.find({ isDoador: true, emailVerificado: true });

        const recipients = doadores.map(u => ({ email: u.email, nome: u.nome }));

        // Enviar emails
        const results = await sendBulkEmail(recipients, {
            subject: post.titulo,
            html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1>${post.titulo}</h1>
          ${post.imagemCapa ? `<img src="${post.imagemCapa}" alt="${post.titulo}" style="max-width: 100%; height: auto;">` : ''}
          <div>${post.conteudo}</div>
        </div>
      `
        });

        post.status = 'enviado';
        post.dataEnvio = new Date();
        post.destinatarios = results.success;
        await post.save();

        res.json({ success: true, message: 'Newsletter enviada com sucesso', results });
    } catch (error) {
        next(error);
    }
};
