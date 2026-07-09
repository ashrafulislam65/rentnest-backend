import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';


export const submitRentalRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyId, startDate, endDate } = req.body;
    const rental = await prisma.rentalRequest.create({
      data: {
        propertyId,
        tenantId: req.user!.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    res.status(201).json({ success: true, message: 'Rental request submitted', data: rental });
  } catch (error) { next(error); }
};

export const getTenantRentals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentals = await prisma.rentalRequest.findMany({
      where: { tenantId: req.user?.id },
      include: { property: true },
    });
    res.status(200).json({ success: true, data: rentals });
  } catch (error) { next(error); }
};