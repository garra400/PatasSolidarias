import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudoHtml: {
        type: String,
        required: true
    },
    imagensAnimais: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    }],
    imagensBrindes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brinde'
    }],
    destinatarios: {
        type: String,
        enum: ['todos', 'apoiadores'],
        default: 'todos'
    },
    status: {
        type: String,
        enum: ['rascunho', 'enviado'],
        default: 'rascunho'
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dataEnvio: {
        type: Date
    },
    totalDestinatarios: {
        type: Number,
        default: 0
    },
    totalAbertos: {
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

postSchema.pre('save', function (next) {
    this.atualizadoEm = new Date();
    next();
});

// Índices
postSchema.index({ status: 1, criadoEm: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
