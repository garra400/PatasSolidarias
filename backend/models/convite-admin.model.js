import mongoose from 'mongoose';

const conviteAdminSchema = new mongoose.Schema({
    emailConvidado: {
        type: String,
        required: true,
        lowercase: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    convidadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissoes: {
        gerenciarAnimais: { type: Boolean, default: true },
        gerenciarFotos: { type: Boolean, default: true },
        gerenciarBrindes: { type: Boolean, default: true },
        gerenciarPosts: { type: Boolean, default: true },
        visualizarAssinantes: { type: Boolean, default: true },
        convidarAdmins: { type: Boolean, default: false },
        gerenciarConfiguracoes: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['pendente', 'aceito', 'expirado', 'cancelado'],
        default: 'pendente'
    },
    dataExpiracao: {
        type: Date,
        required: true
    },
    dataAceite: {
        type: Date
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

// Método para verificar se o convite é válido
conviteAdminSchema.methods.isValido = function () {
    return this.status === 'pendente' && new Date() < this.dataExpiracao;
};

// Índices
conviteAdminSchema.index({ token: 1 });
conviteAdminSchema.index({ emailConvidado: 1, status: 1 });
conviteAdminSchema.index({ dataExpiracao: 1 });

const ConviteAdmin = mongoose.model('ConviteAdmin', conviteAdminSchema);

export default ConviteAdmin;
