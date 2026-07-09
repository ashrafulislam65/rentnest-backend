import express from 'express';
import { createProperty, deleteProperty, getLandlordRequests, handleRentalRequest, updateProperty } from '../controllers/landlord.controller.js';
import { authGuard, authorizeRoles } from '../middlewares/authGuard.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createPropertyValidation } from '../validations/property.validation.js';

const router = express.Router();

router.use(authGuard, authorizeRoles('LANDLORD'));

router.post('/properties', validateRequest(createPropertyValidation), createProperty);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);
router.get('/requests', getLandlordRequests);
router.patch('/requests/:id', handleRentalRequest);

export const landlordRoutes = router;