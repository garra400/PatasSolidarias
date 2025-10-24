import express from 'express';
import { protect, authorize, isDoador } from '../middlewares/auth.middleware.js';
import {
    getResgates,
    getResgate,
    createResgate,
    updateResgate,
    cancelResgate,
    getConfiguracao,
    atualizarConfiguracao
} from '../controllers/resgate.controller.js';

const router = express.Router();

// Rotas de configuração (devem vir antes das rotas com :id)
router.get('/configuracao', protect, getConfiguracao);
router.put('/configuracao', protect, authorize('admin'), atualizarConfiguracao);

// Rotas de resgates
router.get('/', protect, isDoador, getResgates);
router.get('/:id', protect, isDoador, getResgate);
router.post('/', protect, isDoador, createResgate);
router.put('/:id', protect, authorize('admin'), updateResgate);
router.delete('/:id', protect, isDoador, cancelResgate);

export default router;
