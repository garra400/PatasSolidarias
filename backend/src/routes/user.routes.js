import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';
import {
    getProfile,
    updateProfile,
    updatePassword,
    uploadAvatar,
    deleteAccount
} from '../controllers/user.controller.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(protect);

// @route   GET /api/user/profile
router.get('/profile', getProfile);

// @route   PUT /api/user/profile
router.put('/profile', updateProfile);

// @route   PUT /api/user/password
router.put('/password', updatePassword);

// @route   POST /api/user/upload-avatar
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

// @route   DELETE /api/user/account
router.delete('/account', deleteAccount);

export default router;
