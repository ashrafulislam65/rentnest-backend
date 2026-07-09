import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const getAllProperties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, priceMin, priceMax, categoryId, amenities } = req.query;
    const filters: any = { isAvailable: true };

    if (location) filters.location = { contains: String(location), mode: 'insensitive' };
    if (categoryId) filters.categoryId = String(categoryId);
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = Number(priceMin);
      if (priceMax) filters.price.lte = Number(priceMax);
    }
    if (amenities) {
      filters.amenities = { hasEvery: String(amenities).split(',').map(a => a.trim()) };
    }

    const properties = await prisma.property.findMany({ where: filters, include: { category: true } });
    res.status(200).json({ success: true, data: properties });
  } catch (error) { next(error); }
};

export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await prisma.property.findUnique({ where: { id: String(req.params.id) }, include: { category: true, reviews: true } });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, data: property });
  } catch (error) { next(error); }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({ success: true, data: categories });
  } catch (error) { next(error); }
};