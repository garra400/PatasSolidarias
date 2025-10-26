import mongoose from 'mongoose';

const fotoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        default: ''
    },
    animaisIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    }],
    adicionadaPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mesReferencia: {
        type: String,
        required: true,
        // Formato: "YYYY-MM" (ex: "2025-11")
        // Indica o mês em que a foto foi adicionada à galeria
    },
    emailEnviado: {
        type: Boolean,
        default: false
    },
    dataEnvioEmail: {
        type: Date
    },
    criadaEm: {
        type: Date,
        default: Date.now
    }
});

// Índices para performance
fotoSchema.index({ animaisIds: 1 });
fotoSchema.index({ criadaEm: -1 });
fotoSchema.index({ mesReferencia: 1 }); // Novo índice para filtrar por mês

const Foto = mongoose.model('Foto', fotoSchema);

export default Foto;
