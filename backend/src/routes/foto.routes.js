import express from 'express';
import { protect, authorize, isDoador } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import {
    getFotos,
    getFoto,
    uploadFoto,
    updateFoto,
    deleteFoto,
    uploadFotosBatch,
    publicarFotos
} from '../controllers/foto.controller.js';

const router = express.Router();

// Rotas para doadores
router.get('/', protect, isDoador, getFotos);
router.get('/:id', protect, isDoador, getFoto);

// Rotas para admin
router.post('/', protect, authorize('admin'), upload.single('foto'), uploadFoto);
router.post('/batch', protect, authorize('admin'), upload.array('fotos', 20), uploadFotosBatch);
router.post('/publicar', protect, authorize('admin'), publicarFotos);
router.put('/:id', protect, authorize('admin'), updateFoto);
router.delete('/:id', protect, authorize('admin'), deleteFoto);

export default router;
