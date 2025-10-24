import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import {
    getDashboardStats,
    getDoadores,
    getDoador,
    getAdmins,
    promoverAdmin,
    removerAdmin,
    getRelatorioFinanceiro
} from '../controllers/admin.controller.js';

const router = express.Router();

// Todas as rotas requerem admin
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/doadores', getDoadores);
router.get('/doadores/:id', getDoador);
router.get('/admins', getAdmins);
router.put('/admins/promover/:id', promoverAdmin);
router.put('/admins/remover/:id', removerAdmin);
router.get('/relatorio-financeiro', getRelatorioFinanceiro);

export default router;
