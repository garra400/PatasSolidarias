import mongoose from 'mongoose';

const solicitacaoResgateSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brindeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brinde',
        required: true
    },
    dataHorarioEscolhido: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'confirmado', 'cancelado', 'retirado'],
        default: 'pendente'
    },
    observacoes: {
        type: String,
        default: ''
    },
    emailEnviado: {
        type: Boolean,
        default: false
    },
    criadoEm: {
        type: Date,
        default: Date.now
    },
    atualizadoEm: {
        type: Date,
        default: Date.now
    }
});

// Atualizar atualizadoEm antes de salvar
solicitacaoResgateSchema.pre('save', function (next) {
    this.atualizadoEm = new Date();
    next();
});

// Índices para queries
solicitacaoResgateSchema.index({ usuarioId: 1, status: 1 });
solicitacaoResgateSchema.index({ dataHorarioEscolhido: 1 });
solicitacaoResgateSchema.index({ status: 1 });

const SolicitacaoResgate = mongoose.model('SolicitacaoResgate', solicitacaoResgateSchema);

export default SolicitacaoResgate;
