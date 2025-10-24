import Brinde from '../models/Brinde.model.js';
import cloudinary from '../config/cloudinary.js';

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
