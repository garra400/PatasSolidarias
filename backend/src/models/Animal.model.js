import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome do animal é obrigatório'],
        trim: true
    },
    tipo: {
        type: String,
        enum: ['cachorro', 'gato', 'outro'],
        required: [true, 'Tipo do animal é obrigatório']
    },
    raca: {
        type: String,
        trim: true
    },
    idade: {
        type: String,
        trim: true
    },
    genero: {
        type: String,
        enum: ['macho', 'fêmea', 'indefinido'],
        required: true
    },
    descricao: {
        type: String,
        required: [true, 'Descrição é obrigatória']
    },
    foto: {
        type: String,
        required: [true, 'Foto é obrigatória']
    },
    // Novo campo: ID da foto que é o perfil
    fotoPerfilId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foto'
    },
    historia: {
        type: String
    },
    necessidadesEspeciais: {
        type: String
    },
    status: {
        type: String,
        enum: ['ativo', 'adotado', 'falecido', 'inativo'],
        default: 'ativo'
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para popular foto de perfil
animalSchema.virtual('fotoPerfil', {
    ref: 'Foto',
    localField: 'fotoPerfilId',
    foreignField: '_id',
    justOne: true
});

// Virtual para popular todas as fotos do animal
animalSchema.virtual('fotos', {
    ref: 'Foto',
    localField: '_id',
    foreignField: 'animaisIds'
});

const Animal = mongoose.model('Animal', animalSchema);

export default Animal;
