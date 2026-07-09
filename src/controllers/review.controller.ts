import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        propertyId,
        tenantId: req.user!.id,
        rating: Number(rating),
        comment,
      },
    });

    res.status(201).json({ success: true, message: 'Review submitted', data: review });
  } catch (error) { next(error); }
};

export const getPropertyReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId: String(req.params.propertyId) },
      include: { tenant: { select: { id: true, name: true } } },
    });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) { next(error); }
};