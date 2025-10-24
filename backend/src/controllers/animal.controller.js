import Animal from '../models/Animal.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Listar todos os animais
// @route   GET /api/animais
// @access  Public
export const getAnimais = async (req, res, next) => {
    try {
        const { status = 'ativo' } = req.query;

        const animais = await Animal.find({ status }).sort({ dataCadastro: -1 });

        res.json({
            success: true,
            count: animais.length,
            animais
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obter um animal por ID
// @route   GET /api/animais/:id
// @access  Public
export const getAnimal = async (req, res, next) => {
    try {
        const animal = await Animal.findById(req.params.id)
            .populate('fotoPerfil')
            .populate('fotos');

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal não encontrado'
            });
        }

        res.json({
            success: true,
            animal
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Criar novo animal
// @route   POST /api/animais
// @access  Private/Admin
export const createAnimal = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Foto do animal é obrigatória'
            });
        }

        // Upload da foto para Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'patas-solidarias/animais',
                    width: 800,
                    height: 800,
                    crop: 'limit'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const animal = await Animal.create({
            ...req.body,
            foto: result.secure_url
        });

        res.status(201).json({
            success: true,
            message: 'Animal cadastrado com sucesso',
            animal
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar animal
// @route   PUT /api/animais/:id
// @access  Private/Admin
export const updateAnimal = async (req, res, next) => {
    try {
        let animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal não encontrado'
            });
        }

        // Se uma nova foto foi enviada
        if (req.file) {
            // Deletar foto antiga
            if (animal.foto) {
                const publicId = animal.foto.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload nova foto
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'patas-solidarias/animais',
                        width: 800,
                        height: 800,
                        crop: 'limit'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            req.body.foto = result.secure_url;
        }

        animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            message: 'Animal atualizado com sucesso',
            animal
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deletar animal
// @route   DELETE /api/animais/:id
// @access  Private/Admin
export const deleteAnimal = async (req, res, next) => {
    try {
        const animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal não encontrado'
            });
        }

        // Deletar foto do Cloudinary
        if (animal.foto) {
            const publicId = animal.foto.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await animal.deleteOne();

        res.json({
            success: true,
            message: 'Animal deletado com sucesso'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Atualizar foto de perfil do animal
// @route   PUT /api/animais/:id/foto-perfil
// @access  Private/Admin
export const atualizarFotoPerfil = async (req, res, next) => {
    try {
        const { fotoId } = req.body;

        if (!fotoId) {
            return res.status(400).json({
                success: false,
                message: 'ID da foto é obrigatório'
            });
        }

        const animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal não encontrado'
            });
        }

        // Atualizar o fotoPerfilId
        animal.fotoPerfilId = fotoId;
        await animal.save();

        // Buscar animal atualizado com populate
        const animalAtualizado = await Animal.findById(req.params.id)
            .populate('fotoPerfil')
            .populate('fotos');

        res.json({
            success: true,
            message: 'Foto de perfil atualizada com sucesso',
            animal: animalAtualizado
        });
    } catch (error) {
        next(error);
    }
};
