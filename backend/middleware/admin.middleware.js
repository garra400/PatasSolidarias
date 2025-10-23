// Middleware para verificar se o usuário é admin
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Usuário não autenticado'
        });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            error: 'Acesso negado. Apenas administradores podem acessar este recurso.'
        });
    }

    next();
};

// Middleware para verificar permissões específicas
export const checkPermission = (permissao) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Usuário não autenticado'
            });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({
                error: 'Acesso negado. Apenas administradores podem acessar este recurso.'
            });
        }

        // Verificar permissão específica
        if (!req.user.permissoes || !req.user.permissoes[permissao]) {
            return res.status(403).json({
                error: `Acesso negado. Você não tem permissão para: ${permissao}`
            });
        }

        next();
    };
};

// Lista de permissões disponíveis
export const PERMISSOES = {
    GERENCIAR_ANIMAIS: 'gerenciarAnimais',
    GERENCIAR_FOTOS: 'gerenciarFotos',
    GERENCIAR_BRINDES: 'gerenciarBrindes',
    GERENCIAR_POSTS: 'gerenciarPosts',
    VISUALIZAR_ASSINANTES: 'visualizarAssinantes',
    CONVIDAR_ADMINS: 'convidarAdmins',
    GERENCIAR_CONFIGURACOES: 'gerenciarConfiguracoes'
};
