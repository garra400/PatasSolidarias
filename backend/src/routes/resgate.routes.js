import express from 'express';
import { protect, authorize, isDoador } from '../middlewares/auth.middleware.js';
import { getResgates, getResgate, createResgate, updateResgate, cancelResgate } from '../controllers/resgate.controller.js';

const router = express.Router();

router.get('/', protect, isDoador, getResgates);
router.get('/:id', protect, isDoador, getResgate);
router.post('/', protect, isDoador, createResgate);
router.put('/:id', protect, authorize('admin'), updateResgate);
router.delete('/:id', protect, isDoador, cancelResgate);

export default router;
