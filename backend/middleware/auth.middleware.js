import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log('🔍 Token decodificado:', { userId: decoded.userId || decoded.id, email: decoded.email });

    // Buscar usuário completo com permissões atualizadas usando MongoDB nativo
    // Suporta tanto 'userId' (novo formato) quanto 'id' (formato antigo)
    const userId = decoded.userId || decoded.id;

    const db = getDB();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    }, {
      projection: { senha: 0 } // Excluir senha
    });

    if (!user) {
      console.error('❌ Usuário não encontrado no banco:', userId);
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    console.log('✅ Usuário autenticado:', user.email, '| isAdmin:', user.isAdmin);

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
