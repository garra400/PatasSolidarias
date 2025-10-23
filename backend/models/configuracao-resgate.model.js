import mongoose from 'mongoose';

const horarioResgateSchema = new mongoose.Schema({
    horaInicio: {
        type: String,
        required: true // Formato: "09:00"
    },
    horaFim: {
        type: String,
        required: true // Formato: "18:00"
    }
});

const configuracaoResgateSchema = new mongoose.Schema({
    diasSemana: [{
        type: Number,
        min: 0,
        max: 6
        // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    }],
    horariosDisponiveis: [horarioResgateSchema],
    intervaloMinutos: {
        type: Number,
        default: 30
    },
    mensagemInformativa: {
        type: String,
        default: 'Escolha o dia e horário para retirar seu brinde.'
    },
    ativo: {
        type: Boolean,
        default: true
    },
    atualizadoEm: {
        type: Date,
        default: Date.now
    }
});

// Sempre haverá apenas uma configuração (singleton)
configuracaoResgateSchema.statics.getConfig = async function () {
    let config = await this.findOne();
    if (!config) {
        // Criar configuração padrão
        config = await this.create({
            diasSemana: [1, 2, 3, 4, 5], // Segunda a Sexta
            horariosDisponiveis: [
                { horaInicio: '09:00', horaFim: '12:00' },
                { horaInicio: '14:00', horaFim: '18:00' }
            ],
            intervaloMinutos: 30
        });
    }
    return config;
};

configuracaoResgateSchema.pre('save', function (next) {
    this.atualizadoEm = new Date();
    next();
});

const ConfiguracaoResgate = mongoose.model('ConfiguracaoResgate', configuracaoResgateSchema);

export default ConfiguracaoResgate;
