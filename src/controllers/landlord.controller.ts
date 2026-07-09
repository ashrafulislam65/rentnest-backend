import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';


export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await prisma.property.create({
      data: { ...req.body, landlordId: req.user?.id },
    });
    res.status(201).json({ success: true, message: 'Listing created', data: property });
  } catch (error) { next(error); }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await prisma.property.update({
      where: { id: String(req.params.id) },
      data: req.body,
    });
    res.status(200).json({ success: true, message: 'Listing updated', data: property });
  } catch (error) { next(error); }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.property.delete({ where: { id: String(req.params.id) } });
    res.status(200).json({ success: true, message: 'Listing removed successfully' });
  } catch (error) { next(error); }
};

export const getLandlordRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.rentalRequest.findMany({
      where: { property: { landlordId: req.user?.id } },
      include: { tenant: true, property: true },
    });
    res.status(200).json({ success: true, data: requests });
  } catch (error) { next(error); }
};

export const handleRentalRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body; // APPROVED or REJECTED
    const updatedRequest = await prisma.rentalRequest.update({
      where: { id: String(req.params.id) },
      data: { status },
    });
    res.status(200).json({ success: true, message: `Request status updated to ${status}`, data: updatedRequest });
  } catch (error) { next(error); }
};