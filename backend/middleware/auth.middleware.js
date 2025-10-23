import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar usuário completo com permissões atualizadas
    const user = await User.findById(decoded.id).select('-senha');

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = user; // Objeto User completo com isAdmin e permissoes
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user || (!req.user.isAdmin && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};
