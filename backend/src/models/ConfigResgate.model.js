import mongoose from 'mongoose';

const configResgateSchema = new mongoose.Schema({
    diasDisponiveis: [{
        type: String,
        enum: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
    }],
    horariosDisponiveis: [{
        inicio: String, // Ex: "09:00"
        fim: String     // Ex: "12:00"
    }],
    observacoes: {
        type: String
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const ConfigResgate = mongoose.model('ConfigResgate', configResgateSchema);

export default ConfigResgate;
