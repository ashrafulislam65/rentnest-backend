import express from 'express';
import { getMe, loginUser, registerUser } from '../controllers/auth.controller'; 
import { validateRequest } from '../middlewares/validateRequest';

import { authGuard } from '../middlewares/authGuard'; 
import { loginValidationSchema, registerValidationSchema } from '../validations/auth.validation';

const router = express.Router();

router.post('/register', validateRequest(registerValidationSchema), registerUser);
router.post('/login', validateRequest(loginValidationSchema), loginUser);
router.get('/me', authGuard, getMe);

export const authRoutes = router;