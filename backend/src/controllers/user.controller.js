import User from '../models/User.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Obter perfil do usuário
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar perfil
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { nome, telefone } = req.body;

        const user = await User.findById(req.user._id);

        if (nome) user.nome = nome;
        if (telefone) user.telefone = telefone;

        await user.save();

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar senha
// @route   PUT /api/user/password
// @access  Private
export const updatePassword = async (req, res, next) => {
    try {
        const { senhaAtual, novaSenha } = req.body;

        const user = await User.findById(req.user._id).select('+senha');

        // Verificar senha atual
        const isPasswordCorrect = await user.matchPassword(senhaAtual);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Senha atual incorreta'
            });
        }

        user.senha = novaSenha;
        await user.save();

        res.json({
            success: true,
            message: 'Senha alterada com sucesso'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload de avatar
// @route   POST /api/user/upload-avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo enviado'
            });
        }

        // Upload para Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'patas-solidarias/avatars',
                    width: 400,
                    height: 400,
                    crop: 'fill',
                    gravity: 'face'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Deletar avatar antigo se existir
        if (req.user.fotoPerfil) {
            const publicId = req.user.fotoPerfil.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Atualizar usuário
        const user = await User.findById(req.user._id);
        user.fotoPerfil = result.secure_url;
        await user.save();

        res.json({
            success: true,
            message: 'Foto de perfil atualizada',
            fotoPerfil: result.secure_url
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar conta
// @route   DELETE /api/user/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
    try {
        const { senha } = req.body;

        const user = await User.findById(req.user._id).select('+senha');

        // Verificar senha
        const isPasswordCorrect = await user.matchPassword(senha);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Senha incorreta'
            });
        }

        // Deletar foto de perfil do Cloudinary
        if (user.fotoPerfil) {
            const publicId = user.fotoPerfil.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'Conta deletada com sucesso'
        });
    } catch (error) {
        next(error);
    }
};
