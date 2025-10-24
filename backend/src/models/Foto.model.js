import mongoose from 'mongoose';

const fotoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        trim: true
    },
    descricao: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        required: [true, 'URL da foto é obrigatória']
    },
    // Mudança: agora é um array de animais (uma foto pode ter múltiplos animais)
    animaisIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    }],
    // Compatibilidade com código antigo
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    },
    // Status: pendente (não publicada) ou publicada (email enviado)
    status: {
        type: String,
        enum: ['pendente', 'publicada'],
        default: 'pendente'
    },
    // Se email de notificação foi enviado
    emailEnviado: {
        type: Boolean,
        default: false
    },
    // Data em que o email foi enviado
    dataEmailEnviado: {
        type: Date
    },
    exclusivaDoadores: {
        type: Boolean,
        default: false
    },
    dataUpload: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Foto = mongoose.model('Foto', fotoSchema);

export default Foto;
