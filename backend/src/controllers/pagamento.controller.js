import Pagamento from '../models/Pagamento.model.js';
import User from '../models/User.model.js';

export const getPagamentos = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { usuario: req.user._id };

        const pagamentos = await Pagamento.find(query)
            .populate('usuario', 'nome email')
            .sort({ dataPagamento: -1 });

        res.json({ success: true, count: pagamentos.length, pagamentos });
    } catch (error) {
        next(error);
    }
};

export const createPagamentoPix = async (req, res, next) => {
    try {
        const { valor } = req.body;

        const pagamento = await Pagamento.create({
            usuario: req.user._id,
            tipo: 'pix',
            valor,
            mesReferencia: new Date().toISOString().slice(0, 7)
        });

        // Aqui integraria com Mercado Pago para gerar QR Code PIX
        // Por simplicidade, vou simular aprovação automática

        pagamento.status = 'aprovado';
        pagamento.dataAprovacao = new Date();
        await pagamento.save();

        // Atualizar usuário
        const user = await User.findById(req.user._id);
        user.isDoador = true;
        user.totalMesesApoio += 1;
        user.calcularBrindes();
        await user.save();

        res.status(201).json({ success: true, message: 'Pagamento processado', pagamento });
    } catch (error) {
        next(error);
    }
};

export const createAssinatura = async (req, res, next) => {
    try {
        const { valorMensal } = req.body;

        // Aqui integraria com Mercado Pago para criar assinatura
        // Por simplicidade, vou simular

        const user = await User.findById(req.user._id);
        user.isDoador = true;
        user.assinaturaAtiva = {
            tipo: 'mensal',
            valorMensal,
            dataInicio: new Date(),
            dataProximoPagamento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'ativa'
        };
        await user.save();

        const pagamento = await Pagamento.create({
            usuario: req.user._id,
            tipo: 'assinatura',
            valor: valorMensal,
            status: 'aprovado',
            dataAprovacao: new Date(),
            mesReferencia: new Date().toISOString().slice(0, 7)
        });

        user.totalMesesApoio += 1;
        user.calcularBrindes();
        await user.save();

        res.status(201).json({ success: true, message: 'Assinatura criada com sucesso', user, pagamento });
    } catch (error) {
        next(error);
    }
};

export const cancelarAssinatura = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.assinaturaAtiva || user.assinaturaAtiva.status !== 'ativa') {
            return res.status(400).json({ success: false, message: 'Nenhuma assinatura ativa encontrada' });
        }

        user.assinaturaAtiva.status = 'cancelada';
        await user.save();

        res.json({ success: true, message: 'Assinatura cancelada com sucesso' });
    } catch (error) {
        next(error);
    }
};

export const getHistoricoPagamentos = async (req, res, next) => {
    try {
        const pagamentos = await Pagamento.find({ usuario: req.user._id })
            .sort({ dataPagamento: -1 });

        res.json({ success: true, count: pagamentos.length, pagamentos });
    } catch (error) {
        next(error);
    }
};
