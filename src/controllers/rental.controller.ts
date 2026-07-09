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

export const getRentalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rental = await prisma.rentalRequest.findUnique({
      where: { id: String(req.params.id) },
      include: { property: true, tenant: { select: { id: true, name: true, email: true } } },
    });

    if (!rental) return res.status(404).json({ success: false, message: 'Rental request not found' });

    if (rental.tenantId !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request' });
    }

    res.status(200).json({ success: true, data: rental });
  } catch (error) { next(error); }
};