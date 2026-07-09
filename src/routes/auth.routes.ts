import express from 'express';
import { getMe, loginUser, registerUser } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { authGuard } from '../middlewares/authGuard.js';
import { loginValidationSchema, registerValidationSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validateRequest(registerValidationSchema), registerUser);
router.post('/login', validateRequest(loginValidationSchema), loginUser);
router.get('/me', authGuard, getMe);

export const authRoutes = router;