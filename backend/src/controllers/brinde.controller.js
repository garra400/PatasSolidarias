import Brinde from '../models/Brinde.model.js';
import cloudinary from '../config/cloudinary.js';
import { enviarEmailBrindesDisponiveis } from '../services/email.service.js';

export const getBrindes = async (req, res, next) => {
    try {
        const { ativo } = req.query;
        const query = ativo !== undefined ? { ativo: ativo === 'true' } : {};

        const brindes = await Brinde.find(query).sort({ mesesNecessarios: 1 });

        res.json({ success: true, count: brindes.length, brindes });
    } catch (error) {
        next(error);
    }
};

export const getBrinde = async (req, res, next) => {
    try {
        const brinde = await Brinde.findById(req.params.id);

        if (!brinde) {
            return res.status(404).json({ success: false, message: 'Brinde não encontrado' });
        }

        res.json({ success: true, brinde });
    } catch (error) {
        next(error);
    }
};

export const createBrinde = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Imagem é obrigatória' });
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'patas-solidarias/brindes', width: 600, height: 600, crop: 'limit' },
                (error, result) => error ? reject(error) : resolve(result)
            );
            uploadStream.end(req.file.buffer);
        });

        const brinde = await Brinde.create({ ...req.body, imagem: result.secure_url });

        res.status(201).json({ success: true, message: 'Brinde criado com sucesso', brinde });
    } catch (error) {
        next(error);
    }
};

export const updateBrinde = async (req, res, next) => {
    try {
        let brinde = await Brinde.findById(req.params.id);
        if (!brinde) {
            return res.status(404).json({ success: false, message: 'Brinde não encontrado' });
        }

        if (req.file) {
            const publicId = brinde.imagem.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'patas-solidarias/brindes', width: 600, height: 600, crop: 'limit' },
                    (error, result) => error ? reject(error) : resolve(result)
                );
                uploadStream.end(req.file.buffer);
            });

            req.body.imagem = result.secure_url;
        }

        brinde = await Brinde.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.json({ success: true, message: 'Brinde atualizado com sucesso', brinde });
    } catch (error) {
        next(error);
    }
};

export const deleteBrinde = async (req, res, next) => {
    try {
        const brinde = await Brinde.findById(req.params.id);
        if (!brinde) {
            return res.status(404).json({ success: false, message: 'Brinde não encontrado' });
        }

        const publicId = brinde.imagem.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await brinde.deleteOne();

        res.json({ success: true, message: 'Brinde deletado com sucesso' });
    } catch (error) {
        next(error);
    }
};

export const atualizarDisponibilidadeBatch = async (req, res, next) => {
    try {
        const { brindesIds, enviarEmail } = req.body;

        if (!brindesIds || !Array.isArray(brindesIds)) {
            return res.status(400).json({
                success: false,
                message: 'IDs dos brindes são obrigatórios e devem ser um array'
            });
        }

        // Desmarcar todos os brindes como indisponíveis
        await Brinde.updateMany(
            {},
            { disponivelParaResgate: false }
        );

        // Marcar apenas os brindes selecionados como disponíveis
        await Brinde.updateMany(
            { _id: { $in: brindesIds } },
            { disponivelParaResgate: true }
        );

        // Buscar os brindes atualizados
        const brindesAtualizados = await Brinde.find({ _id: { $in: brindesIds } });

        // Enviar email para apoiadores se solicitado
        if (enviarEmail) {
            try {
                await enviarEmailBrindesDisponiveis(brindesAtualizados);
            } catch (emailError) {
                console.error('Erro ao enviar emails:', emailError);
                // Não falhar a requisição se o email falhar
            }
        }

        res.json({
            success: true,
            message: 'Disponibilidade atualizada com sucesso',
            brindes: brindesAtualizados
        });
    } catch (error) {
        next(error);
    }
};

