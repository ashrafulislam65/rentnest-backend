import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';


export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Unauthorized access');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    
    if (req.user?.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been banned!' });
    }
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access Denied' });
    }
    next();
  };
};