import mongoose from 'mongoose';

const pagamentoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tipo: {
        type: String,
        enum: ['pix', 'assinatura'],
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'aprovado', 'recusado', 'cancelado'],
        default: 'pendente'
    },
    mercadoPagoId: {
        type: String
    },
    mercadoPagoStatus: {
        type: String
    },
    metodoPagamento: {
        type: String
    },
    mesReferencia: {
        type: String // Ex: "2025-10"
    },
    dataPagamento: {
        type: Date,
        default: Date.now
    },
    dataAprovacao: {
        type: Date
    }
}, {
    timestamps: true
});

// Índice para buscar pagamentos por mês
pagamentoSchema.index({ usuario: 1, mesReferencia: 1 });

const Pagamento = mongoose.model('Pagamento', pagamentoSchema);

export default Pagamento;
