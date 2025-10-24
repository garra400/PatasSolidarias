import Resgate from '../models/Resgate.model.js';
import Brinde from '../models/Brinde.model.js';
import User from '../models/User.model.js';

export const getResgates = async (req, res, next) => {
    try {
        const query = req.user.role === 'admin' ? {} : { usuario: req.user._id };

        const resgates = await Resgate.find(query)
            .populate('usuario', 'nome email')
            .populate('brinde', 'nome imagem')
            .sort({ dataResgate: -1 });

        res.json({ success: true, count: resgates.length, resgates });
    } catch (error) {
        next(error);
    }
};

export const getResgate = async (req, res, next) => {
    try {
        const resgate = await Resgate.findById(req.params.id)
            .populate('usuario', 'nome email')
            .populate('brinde', 'nome descricao imagem');

        if (!resgate) {
            return res.status(404).json({ success: false, message: 'Resgate não encontrado' });
        }

        // Verificar permissão
        if (req.user.role !== 'admin' && resgate.usuario._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Sem permissão' });
        }

        res.json({ success: true, resgate });
    } catch (error) {
        next(error);
    }
};

export const createResgate = async (req, res, next) => {
    try {
        const { brindeId } = req.body;

        const user = await User.findById(req.user._id);
        user.calcularBrindes();

        if (user.brindesDisponiveis < 1) {
            return res.status(400).json({ success: false, message: 'Você não tem brindes disponíveis' });
        }

        const brinde = await Brinde.findById(brindeId);
        if (!brinde || !brinde.ativo) {
            return res.status(404).json({ success: false, message: 'Brinde não disponível' });
        }

        if (brinde.estoque < 1) {
            return res.status(400).json({ success: false, message: 'Brinde sem estoque' });
        }

        const resgate = await Resgate.create({
            usuario: req.user._id,
            brinde: brindeId,
            ...req.body
        });

        // Decrementar estoque e brindes disponíveis
        brinde.estoque -= 1;
        await brinde.save();

        user.brindesDisponiveis -= 1;
        await user.save();

        await resgate.populate('brinde', 'nome imagem');

        res.status(201).json({ success: true, message: 'Resgate solicitado com sucesso', resgate });
    } catch (error) {
        next(error);
    }
};

export const updateResgate = async (req, res, next) => {
    try {
        const resgate = await Resgate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('usuario', 'nome email').populate('brinde', 'nome imagem');

        if (!resgate) {
            return res.status(404).json({ success: false, message: 'Resgate não encontrado' });
        }

        res.json({ success: true, message: 'Resgate atualizado com sucesso', resgate });
    } catch (error) {
        next(error);
    }
};

export const cancelResgate = async (req, res, next) => {
    try {
        const resgate = await Resgate.findById(req.params.id);

        if (!resgate) {
            return res.status(404).json({ success: false, message: 'Resgate não encontrado' });
        }

        if (resgate.status !== 'pendente') {
            return res.status(400).json({ success: false, message: 'Resgate já foi processado' });
        }

        // Restaurar estoque e brindes
        const brinde = await Brinde.findById(resgate.brinde);
        brinde.estoque += 1;
        await brinde.save();

        const user = await User.findById(resgate.usuario);
        user.brindesDisponiveis += 1;
        await user.save();

        await resgate.deleteOne();

        res.json({ success: true, message: 'Resgate cancelado com sucesso' });
    } catch (error) {
        next(error);
    }
};
