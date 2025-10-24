import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    telefone: {
        type: String,
        required: [true, 'Telefone é obrigatório']
    },
    cpf: {
        type: String,
        required: [true, 'CPF é obrigatório'],
        unique: true
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: 6,
        select: false
    },
    fotoPerfil: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isDoador: {
        type: Boolean,
        default: false
    },
    emailVerificado: {
        type: Boolean,
        default: false
    },
    assinaturaAtiva: {
        tipo: {
            type: String,
            enum: ['mensal', 'avulso'],
            default: null
        },
        valorMensal: Number,
        dataInicio: Date,
        dataProximoPagamento: Date,
        status: {
            type: String,
            enum: ['ativa', 'cancelada', 'suspensa'],
            default: null
        },
        mercadoPagoId: String
    },
    totalMesesApoio: {
        type: Number,
        default: 0
    },
    brindesDisponiveis: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date
}, {
    timestamps: true
});

// Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para comparar senha
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.senha);
};

// Calcular brindes disponíveis
userSchema.methods.calcularBrindes = function () {
    this.brindesDisponiveis = Math.floor(this.totalMesesApoio / 3);
    return this.brindesDisponiveis;
};

const User = mongoose.model('User', userSchema);

export default User;
