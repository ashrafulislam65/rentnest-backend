import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
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

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const payment = await tx.payment.create({
        data: { rentalRequestId, amount, transactionId, method: 'Stripe', status: 'COMPLETED', paidAt: new Date() },
      });

      await tx.rentalRequest.update({
        where: { id: rentalRequestId },
        data: { status: 'ACTIVE' },
      });

      return payment;
    }, {
      maxWait: 10000,
      timeout: 15000,
    });

    res.status(200).json({ success: true, message: 'Payment confirmed successfully', data: result });
  } catch (error) { next(error); }
};

export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { rentalRequest: { tenantId: req.user?.id } },
      include: { rentalRequest: { include: { property: true } } },
    });
    res.status(200).json({ success: true, data: payments });
  } catch (error) { next(error); }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: String(req.params.id) },
      include: { rentalRequest: { include: { property: true } } },
    });

    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (payment.rentalRequest.tenantId !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this payment' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) { next(error); }
};