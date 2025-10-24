import mongoose from 'mongoose';

const resgateSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brinde: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brinde',
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'aprovado', 'rejeitado', 'entregue'],
        default: 'pendente'
    },
    dataResgate: {
        type: Date,
        default: Date.now
    },
    dataRetirada: {
        type: Date
    },
    horarioRetirada: {
        type: String
    },
    observacoes: {
        type: String
    },
    motivoRejeicao: {
        type: String
    }
}, {
    timestamps: true
});

const Resgate = mongoose.model('Resgate', resgateSchema);

export default Resgate;
