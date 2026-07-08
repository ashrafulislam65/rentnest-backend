import express from 'express';
import { getAllProperties, getPropertyById, getCategories } from '../controllers/property.controller.js';

const router = express.Router();

router.get('/properties', getAllProperties);
router.get('/properties/:id', getPropertyById);
router.get('/categories', getCategories);

export const publicPropertyRoutes = router;