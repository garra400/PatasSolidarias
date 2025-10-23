import mongoose from 'mongoose';

const emailPostSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emailUsuario: {
        type: String,
        required: true
    },
    enviadoEm: {
        type: Date,
        default: Date.now
    },
    aberto: {
        type: Boolean,
        default: false
    },
    dataAbertura: {
        type: Date
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
});

// Índices para tracking
emailPostSchema.index({ postId: 1, usuarioId: 1 });
emailPostSchema.index({ token: 1 });
emailPostSchema.index({ aberto: 1 });

const EmailPost = mongoose.model('EmailPost', emailPostSchema);

export default EmailPost;
