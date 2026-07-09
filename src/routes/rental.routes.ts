import express from 'express';
import { getTenantRentals, submitRentalRequest, getRentalById } from '../controllers/rental.controller.js';
import { authGuard, authorizeRoles } from '../middlewares/authGuard.js';

const router = express.Router();

router.use(authGuard, authorizeRoles('TENANT'));
router.post('/', submitRentalRequest);
router.get('/', getTenantRentals);
router.get('/:id', getRentalById);

export const rentalRoutes = router;