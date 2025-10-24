export const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro:', err);

    // Erro de validação do Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors
        });
    }

    // Erro de chave duplicada
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} já está em uso`
        });
    }

    // Erro de cast (ID inválido)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID inválido'
        });
    }

    // Erro de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }

    // Erro de token expirado
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado'
        });
    }

    // Erro padrão
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
