import express from 'express';
import { createPaymentIntent, confirmPayment, getMyPayments, getPaymentById } from '../controllers/payment.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = express.Router();

router.post('/create', authGuard, createPaymentIntent);
router.post('/confirm', authGuard, confirmPayment);
router.get('/', authGuard, getMyPayments);
router.get('/:id', authGuard, getPaymentById);

export const paymentRoutes = router;