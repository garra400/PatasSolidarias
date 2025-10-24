import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import {
    getAnimais,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    atualizarFotoPerfil
} from '../controllers/animal.controller.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAnimais);
router.get('/:id', getAnimal);

// Rotas protegidas (Admin)
router.post('/', protect, authorize('admin'), upload.single('foto'), createAnimal);
router.put('/:id', protect, authorize('admin'), upload.single('foto'), updateAnimal);
router.put('/:id/foto-perfil', protect, authorize('admin'), atualizarFotoPerfil);
router.delete('/:id', protect, authorize('admin'), deleteAnimal);

export default router;
