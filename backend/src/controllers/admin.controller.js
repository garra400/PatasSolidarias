import User from '../models/User.model.js';
import Pagamento from '../models/Pagamento.model.js';
import Animal from '../models/Animal.model.js';
import Brinde from '../models/Brinde.model.js';
import Resgate from '../models/Resgate.model.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalDoadores,
            totalAnimais,
            totalBrindes,
            totalResgates,
            pagamentosMes
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isDoador: true }),
            Animal.countDocuments({ status: 'ativo' }),
            Brinde.countDocuments({ ativo: true }),
            Resgate.countDocuments(),
            Pagamento.aggregate([
                {
                    $match: {
                        status: 'aprovado',
                        dataAprovacao: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$valor' },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const assinaturasAtivas = await User.countDocuments({
            'assinaturaAtiva.status': 'ativa'
        });

        const resgatesPendentes = await Resgate.countDocuments({ status: 'pendente' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalDoadores,
                totalAnimais,
                totalBrindes,
                totalResgates,
                assinaturasAtivas,
                resgatesPendentes,
                receitaMes: pagamentosMes[0]?.total || 0,
                pagamentosMes: pagamentosMes[0]?.count || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getDoadores = async (req, res, next) => {
    try {
        const doadores = await User.find({ isDoador: true })
            .select('-senha')
            .sort({ totalMesesApoio: -1 });

        res.json({ success: true, count: doadores.length, doadores });
    } catch (error) {
        next(error);
    }
};

export const getDoador = async (req, res, next) => {
    try {
        const doador = await User.findById(req.params.id).select('-senha');

        if (!doador) {
            return res.status(404).json({ success: false, message: 'Doador não encontrado' });
        }

        const pagamentos = await Pagamento.find({ usuario: doador._id })
            .sort({ dataPagamento: -1 })
            .limit(10);

        const resgates = await Resgate.find({ usuario: doador._id })
            .populate('brinde', 'nome imagem')
            .sort({ dataResgate: -1 })
            .limit(5);

        res.json({ success: true, doador, pagamentos, resgates });
    } catch (error) {
        next(error);
    }
};

export const getAdmins = async (req, res, next) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-senha');

        res.json({ success: true, count: admins.length, admins });
    } catch (error) {
        next(error);
    }
};

export const promoverAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Usuário já é admin' });
        }

        user.role = 'admin';
        await user.save();

        res.json({ success: true, message: 'Usuário promovido a admin com sucesso', user });
    } catch (error) {
        next(error);
    }
};

export const removerAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ success: false, message: 'Usuário não é admin' });
        }

        // Não permitir remover o próprio admin
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Não é possível remover a si mesmo' });
        }

        user.role = 'user';
        await user.save();

        res.json({ success: true, message: 'Permissões de admin removidas com sucesso', user });
    } catch (error) {
        next(error);
    }
};

export const getRelatorioFinanceiro = async (req, res, next) => {
    try {
        const { ano, mes } = req.query;

        const match = { status: 'aprovado' };

        if (ano && mes) {
            const startDate = new Date(ano, mes - 1, 1);
            const endDate = new Date(ano, mes, 0, 23, 59, 59);
            match.dataAprovacao = { $gte: startDate, $lte: endDate };
        }

        const relatorio = await Pagamento.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$tipo',
                    total: { $sum: '$valor' },
                    quantidade: { $sum: 1 }
                }
            }
        ]);

        const totalGeral = relatorio.reduce((acc, curr) => acc + curr.total, 0);

        res.json({ success: true, relatorio, totalGeral });
    } catch (error) {
        next(error);
    }
};
