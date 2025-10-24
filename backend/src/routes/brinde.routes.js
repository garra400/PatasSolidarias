import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import { getBrindes, getBrinde, createBrinde, updateBrinde, deleteBrinde } from '../controllers/brinde.controller.js';

const router = express.Router();

router.get('/', protect, getBrindes);
router.get('/:id', protect, getBrinde);
router.post('/', protect, authorize('admin'), upload.single('imagem'), createBrinde);
router.put('/:id', protect, authorize('admin'), upload.single('imagem'), updateBrinde);
router.delete('/:id', protect, authorize('admin'), deleteBrinde);

export default router;
