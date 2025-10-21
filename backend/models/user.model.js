import mongoose from 'mongoose';

const pagamentoSchema = new mongoose.Schema({
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
    enum: ['aprovado', 'pendente', 'recusado'],
    default: 'pendente'
  },
  data: {
    type: Date,
    default: Date.now
  },
  mercadoPagoId: String,
  mesReferencia: String // Ex: "2025-10"
});

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  telefone: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
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
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  assinaturaAtiva: {
    tipo: {
      type: String,
      enum: ['mensal', 'avulso']
    },
    valorMensal: Number,
    dataInicio: Date,
    dataProximoPagamento: Date,
    status: {
      type: String,
      enum: ['ativa', 'cancelada', 'suspensa'],
      default: 'ativa'
    }
  },
  historicoPagamentos: [pagamentoSchema],
  totalMesesApoio: {
    type: Number,
    default: 0
  },
  brindesDisponiveis: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date
});

// Método para calcular total de meses e brindes
userSchema.methods.calcularMesesApoio = function() {
  const pagamentosAprovados = this.historicoPagamentos.filter(p => p.status === 'aprovado');
  
  // Contar meses únicos de referência
  const mesesUnicos = new Set();
  
  pagamentosAprovados.forEach(pagamento => {
    if (pagamento.mesReferencia) {
      mesesUnicos.add(pagamento.mesReferencia);
    }
  });
  
  this.totalMesesApoio = mesesUnicos.size;
  this.brindesDisponiveis = Math.floor(this.totalMesesApoio / 3);
  
  // Atualizar status de doador
  this.isDoador = this.totalMesesApoio > 0 || (this.assinaturaAtiva && this.assinaturaAtiva.status === 'ativa');
  
  return this.totalMesesApoio;
};

const User = mongoose.model('User', userSchema);

export default User;
