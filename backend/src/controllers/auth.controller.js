import { validationResult } from 'express-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { sendEmail } from '../services/email.service.js';

// Gerar Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { nome, email, telefone, cpf, senha } = req.body;

        // Verificar se usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Email já cadastrado'
            });
        }

        // Verificar se CPF já existe
        const cpfExists = await User.findOne({ cpf });
        if (cpfExists) {
            return res.status(400).json({
                success: false,
                message: 'CPF já cadastrado'
            });
        }

        // Criar usuário
        const user = await User.create({
            nome,
            email,
            telefone,
            cpf,
            senha
        });

        // Gerar token de verificação de email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
        await user.save();

        // Enviar email de verificação
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Verificação de Email - Patas Solidárias',
            template: 'email-verification',
            context: {
                nome: user.nome,
                verificationUrl
            }
        });

        // Gerar token JWT
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso. Verifique seu email.',
            token,
            user: {
                _id: user._id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                cpf: user.cpf,
                role: user.role,
                isDoador: user.isDoador,
                emailVerificado: user.emailVerificado
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, senha } = req.body;

        // Verificar se usuário existe
        const user = await User.findOne({ email }).select('+senha');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }

        // Verificar senha
        const isPasswordCorrect = await user.matchPassword(senha);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }

        // Gerar token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone,
                cpf: user.cpf,
                fotoPerfil: user.fotoPerfil,
                role: user.role,
                isDoador: user.isDoador,
                emailVerificado: user.emailVerificado,
                assinaturaAtiva: user.assinaturaAtiva,
                totalMesesApoio: user.totalMesesApoio,
                brindesDisponiveis: user.brindesDisponiveis
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verificar email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Hash do token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Buscar usuário
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        // Verificar email
        user.emailVerificado = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verificado com sucesso!'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Solicitar recuperação de senha
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // Gerar token de reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hora
        await user.save();

        // Enviar email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Recuperação de Senha - Patas Solidárias',
            template: 'password-reset',
            context: {
                nome: user.nome,
                resetUrl
            }
        });

        res.json({
            success: true,
            message: 'Email de recuperação enviado'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resetar senha
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { novaSenha } = req.body;

        // Hash do token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Buscar usuário
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        // Atualizar senha
        user.senha = novaSenha;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });
    } catch (error) {
        next(error);
    }
};
