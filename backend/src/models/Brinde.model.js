import mongoose from 'mongoose';

const brindeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome do brinde é obrigatório'],
        trim: true
    },
    descricao: {
        type: String,
        required: [true, 'Descrição é obrigatória']
    },
    imagem: {
        type: String,
        required: [true, 'Imagem é obrigatória']
    },
    mesesNecessarios: {
        type: Number,
        required: [true, 'Quantidade de meses necessários é obrigatória'],
        min: 1
    },
    estoque: {
        type: Number,
        required: [true, 'Estoque é obrigatório'],
        min: 0,
        default: 0
    },
    ativo: {
        type: Boolean,
        default: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Brinde = mongoose.model('Brinde', brindeSchema);

export default Brinde;
