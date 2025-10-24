import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // Verificar se o token existe no header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado - Token não fornecido'
            });
        }

        // Verificar token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuário no banco
        try {
            req.user = await User.findById(decoded.id).select('-senha');
        } catch (dbError) {
            console.error('Erro ao verificar token:', dbError);
            return res.status(500).json({
                success: false,
                message: 'Erro ao verificar autenticação - Banco de dados indisponível'
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        console.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar autenticação'
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Sem permissão para acessar este recurso'
            });
        }
        next();
    };
};

export const isDoador = async (req, res, next) => {
    if (!req.user.isDoador) {
        return res.status(403).json({
            success: false,
            message: 'Acesso restrito a doadores'
        });
    }
    next();
};
