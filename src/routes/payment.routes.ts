import express from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/payment.controller.js';
import { authGuard } from '../middlewares/authGuard.js';

const router = express.Router();

router.post('/create', authGuard, createPaymentIntent);
router.post('/confirm', authGuard, confirmPayment);

export const paymentRoutes = router;