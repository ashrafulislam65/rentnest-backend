import express from 'express';
import {
  getAllUsers,
  toggleUserBan,
  getAllPropertiesAdmin,
  getAllRentalsAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/admin.controller.js';
import { authGuard, authorizeRoles } from '../middlewares/authGuard.js';

const router = express.Router();
router.use(authGuard, authorizeRoles('ADMIN'));

router.get('/users', getAllUsers);
router.patch('/users/:id/ban', toggleUserBan);

router.get('/properties', getAllPropertiesAdmin);
router.get('/rentals', getAllRentalsAdmin);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export const adminRoutes = router;