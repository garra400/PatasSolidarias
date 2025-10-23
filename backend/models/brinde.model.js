import mongoose from 'mongoose';

const brindeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        required: true
    },
    fotoUrl: {
        type: String,
        required: true
    },
    disponivelParaResgate: {
        type: Boolean,
        default: false
    },
    ordem: {
        type: Number,
        default: 0
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
brindeSchema.pre('save', function (next) {
    this.atualizadoEm = new Date();
    next();
});

// Índice para ordenação
brindeSchema.index({ ordem: 1, disponivelParaResgate: 1 });

const Brinde = mongoose.model('Brinde', brindeSchema);

export default Brinde;
