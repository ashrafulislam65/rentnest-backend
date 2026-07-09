import express from 'express';
import { getAllUsers, toggleUserBan } from '../controllers/admin.controller.js';
import { authGuard, authorizeRoles } from '../middlewares/authGuard.js';

const router = express.Router();
router.use(authGuard, authorizeRoles('ADMIN'));

router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleUserBan);

export const adminRoutes = router;