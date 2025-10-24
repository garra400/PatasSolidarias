import express from 'express';
import { body } from 'express-validator';
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
    body('cpf').notEmpty().withMessage('CPF é obrigatório'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], register);

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
], login);

// @route   GET /api/auth/verify-email/:token
// @desc    Verificar email
// @access  Public
router.get('/verify-email/:token', verifyEmail);

// @route   POST /api/auth/forgot-password
// @desc    Solicitar recuperação de senha
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Email inválido')
], forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Resetar senha
// @access  Public
router.post('/reset-password/:token', [
    body('novaSenha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], resetPassword);

export default router;
