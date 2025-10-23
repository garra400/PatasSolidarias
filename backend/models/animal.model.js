import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true
  },
  fotoUrl: {
    type: String,
    required: true
  },
  fotoPerfilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Foto'
  },
  mesDisponivel: {
    type: String,
    required: true,
    // Formato: "2025-10" (ano-mês)
  },
  tipo: {
    type: String,
    enum: ['gato', 'cachorro', 'outro'],
    default: 'gato'
  },
  idade: {
    type: String,
    default: 'Adulto'
  },
  sexo: {
    type: String,
    enum: ['macho', 'femea', 'não informado'],
    default: 'não informado'
  },
  status: {
    type: String,
    enum: ['disponivel', 'adotado', 'em tratamento'],
    default: 'disponivel'
  },
  historia: {
    type: String,
    default: ''
  },
  caracteristicas: [{
    type: String
  }],
  necessidadesEspeciais: {
    type: Boolean,
    default: false
  },
  detalhesNecessidades: {
    type: String,
    default: ''
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

// Atualizar atualizadoEm antes de salvar
animalSchema.pre('save', function (next) {
  this.atualizadoEm = new Date();
  next();
});

// Método para verificar se o animal está disponível para visualização no mês atual
animalSchema.methods.isDisponivelParaMes = function (mesReferencia) {
  return this.mesDisponivel === mesReferencia && this.status === 'disponivel';
};

const Animal = mongoose.model('Animal', animalSchema);

export default Animal;
