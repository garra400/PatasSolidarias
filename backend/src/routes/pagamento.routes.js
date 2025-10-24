import express from 'express';
import { protect, authorize, isDoador } from '../middlewares/auth.middleware.js';
import { getPagamentos, createPagamentoPix, createAssinatura, cancelarAssinatura, getHistoricoPagamentos } from '../controllers/pagamento.controller.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getPagamentos);
router.get('/historico', protect, isDoador, getHistoricoPagamentos);
router.post('/pix', protect, createPagamentoPix);
router.post('/assinatura', protect, createAssinatura);
router.put('/assinatura/cancelar', protect, isDoador, cancelarAssinatura);

export default router;
