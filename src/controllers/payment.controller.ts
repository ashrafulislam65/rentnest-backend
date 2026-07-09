import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import prisma from '../config/prisma.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rentalRequestId } = req.body;
    const rental = await prisma.rentalRequest.findUnique({
      where: { id: rentalRequestId },
      include: { property: true },
    });

    if (!rental || rental.status !== 'APPROVED') {
      return res.status(400).json({ success: false, message: 'Rental request is not approved for payment' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: rental.property.price * 100,
      currency: 'usd',
      metadata: { rentalRequestId },
    });

    res.status(200).json({ success: true, data: { clientSecret: paymentIntent.client_secret } });
  } catch (error) { next(error); }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rentalRequestId, transactionId, amount } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: { rentalRequestId, amount, transactionId, method: 'Stripe', status: 'COMPLETED', paidAt: new Date() },
      });

      await tx.rentalRequest.update({
        where: { id: rentalRequestId },
        data: { status: 'ACTIVE' },
      });

      return payment;
    });

    res.status(200).json({ success: true, message: 'Payment confirmed successfully', data: result });
  } catch (error) { next(error); }
};