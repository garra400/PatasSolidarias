import Foto from '../models/Foto.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Listar fotos
// @route   GET /api/fotos
// @access  Private (Doadores)
export const getFotos = async (req, res, next) => {
    try {
        const { animal, exclusivaDoadores, status, animalId, limit = 20, skip = 0 } = req.query;

        const query = {};
        if (animal) query.animal = animal;
        if (animalId) query.animaisIds = animalId;
        if (status) query.status = status;
        if (exclusivaDoadores !== undefined) query.exclusivaDoadores = exclusivaDoadores === 'true';

        const total = await Foto.countDocuments(query);

        const fotos = await Foto.find(query)
            .populate('animaisIds', 'nome tipo')
            .populate('animal', 'nome tipo')
            .populate('uploadedBy', 'nome')
            .sort({ dataUpload: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        res.json({
            success: true,
            count: fotos.length,
            total,
            hasMore: total > parseInt(skip) + parseInt(limit),
            fotos
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obter uma foto por ID
// @route   GET /api/fotos/:id
// @access  Private (Doadores)
export const getFoto = async (req, res, next) => {
    try {
        const foto = await Foto.findById(req.params.id)
            .populate('animal', 'nome tipo')
            .populate('uploadedBy', 'nome');

        if (!foto) {
            return res.status(404).json({
                success: false,
                message: 'Foto não encontrada'
            });
        }

        res.json({
            success: true,
            foto
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload de foto
// @route   POST /api/fotos
// @access  Private/Admin
export const uploadFoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo enviado'
            });
        }

        // Upload para Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'patas-solidarias/galeria',
                    width: 1200,
                    height: 1200,
                    crop: 'limit'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const foto = await Foto.create({
            ...req.body,
            url: result.secure_url,
            uploadedBy: req.user._id
        });

        await foto.populate('animal', 'nome tipo');

        res.status(201).json({
            success: true,
            message: 'Foto enviada com sucesso',
            foto
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar foto
// @route   PUT /api/fotos/:id
// @access  Private/Admin
export const updateFoto = async (req, res, next) => {
    try {
        const foto = await Foto.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('animal', 'nome tipo');

        if (!foto) {
            return res.status(404).json({
                success: false,
                message: 'Foto não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Foto atualizada com sucesso',
            foto
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar foto
// @route   DELETE /api/fotos/:id
// @access  Private/Admin
export const deleteFoto = async (req, res, next) => {
    try {
        const foto = await Foto.findById(req.params.id);

        if (!foto) {
            return res.status(404).json({
                success: false,
                message: 'Foto não encontrada'
            });
        }

        // Deletar do Cloudinary
        const publicId = foto.url.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await foto.deleteOne();

        res.json({
            success: true,
            message: 'Foto deletada com sucesso'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload em batch (múltiplas fotos)
// @route   POST /api/fotos/batch
// @access  Private/Admin
export const uploadFotosBatch = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum arquivo enviado'
            });
        }

        const { descricoes, animaisIds } = req.body;
        const descricoesArray = JSON.parse(descricoes || '[]');
        const animaisIdsArray = JSON.parse(animaisIds || '[]');

        const fotosUpload = [];

        // Upload de cada foto para Cloudinary
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'patas-solidarias/galeria',
                        width: 1200,
                        height: 1200,
                        crop: 'limit'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(file.buffer);
            });

            const foto = await Foto.create({
                url: result.secure_url,
                descricao: descricoesArray[i] || '',
                animaisIds: animaisIdsArray[i] || [],
                uploadedBy: req.user._id,
                status: 'pendente',
                emailEnviado: false
            });

            fotosUpload.push(foto);
        }

        res.status(201).json({
            success: true,
            message: `${fotosUpload.length} foto(s) enviada(s) com sucesso`,
            fotos: fotosUpload
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Publicar fotos e enviar email para usuários
// @route   POST /api/fotos/publicar
// @access  Private/Admin
export const publicarFotos = async (req, res, next) => {
    try {
        const { fotosIds } = req.body;

        if (!fotosIds || fotosIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nenhuma foto selecionada'
            });
        }

        // Atualizar status das fotos
        const result = await Foto.updateMany(
            { _id: { $in: fotosIds } },
            {
                status: 'publicada',
                emailEnviado: true,
                dataEmailEnviado: new Date()
            }
        );

        // TODO: Implementar envio de email
        // Buscar todos os usuários e enviar email com as novas fotos
        // await emailService.enviarNotificacaoNovasFotos(fotosIds);

        res.json({
            success: true,
            message: `${result.modifiedCount} foto(s) publicada(s) com sucesso`,
            fotosPublicadas: result.modifiedCount,
            emailsEnviados: result.modifiedCount // Será o número real quando implementar envio
        });
    } catch (error) {
        next(error);
    }
};
