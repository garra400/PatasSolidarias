import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    conteudo: {
        type: String,
        required: [true, 'Conteúdo é obrigatório']
    },
    resumo: {
        type: String,
        trim: true
    },
    imagemCapa: {
        type: String
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['rascunho', 'publicado', 'enviado'],
        default: 'rascunho'
    },
    dataPublicacao: {
        type: Date
    },
    dataEnvio: {
        type: Date
    },
    destinatarios: {
        type: Number, // Quantidade de emails enviados
        default: 0
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;
