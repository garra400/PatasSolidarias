import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getDB } from '../db.js';
import { sendRegistrationEmail, sendPasswordResetEmail } from '../services/email.service.js';

const router = express.Router();

// Registrar usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, telefone, cpf } = req.body;
    
    const db = getDB();
    const users = db.collection('users');
    
    // Verificar se o usuário já existe
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    
    // Hash da senha usando bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(senha, 10);
    console.log('🔐 Senha criptografada com bcrypt (10 rounds)');
    
    // Gerar token de confirmação
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    
    // Criar usuário
    const newUser = {
      nome,
      email,
      senha: hashedPassword,
      telefone,
      cpf,
      tipo: 'adotante',
      emailConfirmado: false,
      confirmationToken,
      tokenExpiry,
      criadoEm: new Date()
    };
    
    const result = await users.insertOne(newUser);
    console.log('✅ Usuário criado com ID:', result.insertedId);
    
    // Enviar email de confirmação
    const emailResult = await sendRegistrationEmail(email, nome, confirmationToken);
    
    if (emailResult.success) {
      console.log('📧 Email de confirmação enviado para:', email);
    } else {
      console.log('⚠️  Email não enviado (configure EMAIL_USER e EMAIL_PASSWORD no .env)');
    }
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso! Verifique seu email para confirmar o cadastro.',
      user: {
        id: result.insertedId,
        nome,
        email,
        tipo: 'adotante',
        emailConfirmado: false
      },
      emailEnviado: emailResult.success
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    const db = getDB();
    const users = db.collection('users');
    
    // Buscar usuário
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    
    // Verificar senha usando bcrypt.compare (descriptografa e compara)
    const validPassword = await bcrypt.compare(senha, user.senha);
    console.log('🔐 Verificação de senha com bcrypt:', validPassword ? 'Sucesso' : 'Falhou');
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }
    
    // Verificar se o email foi confirmado
    if (!user.emailConfirmado) {
      return res.status(403).json({ 
        message: 'Por favor, confirme seu email antes de fazer login',
        emailConfirmado: false
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login bem-sucedido para:', email);
    
    res.json({
      user: {
        _id: user._id.toString(),
        nome: user.nome,
        email: user.email,
        telefone: user.telefone || '',
        cpf: user.cpf || '',
        role: user.role || user.tipo || 'user',
        isDoador: user.isDoador || false,
        emailVerificado: user.emailConfirmado || false,
        dataCriacao: user.criadoEm || new Date(),
        assinaturaAtiva: user.assinaturaAtiva,
        historicoPagamentos: user.historicoPagamentos || [],
        totalMesesApoio: user.totalMesesApoio || 0,
        brindesDisponiveis: user.brindesDisponiveis || 0
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Recuperar senha
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const db = getDB();
    const users = db.collection('users');
    
    // Verificar se o usuário existe
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email não encontrado' });
    }
    
    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    
    // Salvar token no banco
    await users.updateOne(
      { email },
      { 
        $set: { 
          resetPasswordToken: resetToken,
          resetPasswordExpiry: tokenExpiry
        }
      }
    );
    
    console.log('🔑 Token de recuperação gerado para:', email);
    
    // Enviar email de recuperação
    const emailResult = await sendPasswordResetEmail(email, user.nome, resetToken);
    
    if (emailResult.success) {
      console.log('📧 Email de recuperação enviado para:', email);
      res.json({ 
        message: 'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.',
        emailEnviado: true
      });
    } else {
      console.log('⚠️  Email não enviado (configure EMAIL_USER e EMAIL_PASSWORD no .env)');
      res.json({ 
        message: 'Token de recuperação gerado, mas email não pôde ser enviado.',
        emailEnviado: false,
        token: resetToken // apenas para testes, remover em produção
      });
    }
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    res.status(500).json({ message: 'Erro ao recuperar senha' });
  }
});

// Confirmar email
router.post('/confirm-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    const db = getDB();
    const users = db.collection('users');
    
    // Buscar usuário com o token
    const user = await users.findOne({ 
      confirmationToken: token,
      tokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }
    
    // Atualizar usuário
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          emailConfirmado: true,
          confirmationToken: null,
          tokenExpiry: null
        }
      }
    );
    
    console.log('✅ Email confirmado para:', user.email);
    
    // Gerar token JWT para login automático
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Email confirmado com sucesso!',
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      },
      token: jwtToken
    });
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    res.status(500).json({ message: 'Erro ao confirmar email' });
  }
});

// Redefinir senha
router.post('/reset-password-confirm', async (req, res) => {
  try {
    const { token, novaSenha } = req.body;
    
    const db = getDB();
    const users = db.collection('users');
    
    // Buscar usuário com o token
    const user = await users.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    console.log('🔐 Nova senha criptografada com bcrypt');
    
    // Atualizar senha
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          senha: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpiry: null
        }
      }
    );
    
    console.log('✅ Senha redefinida para:', user.email);
    
    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao redefinir senha' });
  }
});

export default router;
