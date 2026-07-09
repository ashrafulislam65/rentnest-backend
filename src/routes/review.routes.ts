import express from 'express';
import { createReview, getPropertyReviews } from '../controllers/review.controller.js';
import { authGuard, authorizeRoles } from '../middlewares/authGuard.js';

const router = express.Router();

router.post('/', authGuard, authorizeRoles('TENANT'), createReview);
router.get('/:propertyId', getPropertyReviews);

export const reviewRoutes = router;