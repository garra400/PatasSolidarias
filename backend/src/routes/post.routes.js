import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import { getPosts, getPost, createPost, updatePost, deletePost, enviarNewsletter } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getPosts);
router.get('/:id', protect, authorize('admin'), getPost);
router.post('/', protect, authorize('admin'), upload.single('imagemCapa'), createPost);
router.put('/:id', protect, authorize('admin'), upload.single('imagemCapa'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);
router.post('/:id/enviar', protect, authorize('admin'), enviarNewsletter);

export default router;
