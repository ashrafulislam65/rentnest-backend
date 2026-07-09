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