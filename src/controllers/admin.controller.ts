import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ success: true, data: users });
  } catch (error) { next(error); }
};

export const toggleUserBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isBanned } = req.body;
    const user = await prisma.user.update({
      where: { id: String(req.params.id) },
      data: { isBanned },
    });
    res.status(200).json({ success: true, message: `User status updated successfully`, data: user });
  } catch (error) { next(error); }
};

export const getAllPropertiesAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await prisma.property.findMany({ include: { category: true } });
    res.status(200).json({ success: true, data: properties });
  } catch (error) { next(error); }
};

export const getAllRentalsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentals = await prisma.rentalRequest.findMany({
      include: { property: true, tenant: true },
    });
    res.status(200).json({ success: true, data: rentals });
  } catch (error) { next(error); }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) { next(error); }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id: String(req.params.id) },
      data: { name },
    });
    res.status(200).json({ success: true, message: 'Category updated', data: category });
  } catch (error) { next(error); }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.category.delete({ where: { id: String(req.params.id) } });
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
};