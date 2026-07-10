import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import { publicPropertyRoutes } from './routes/property.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { landlordRoutes } from './routes/landlord.routes.js';
import { rentalRoutes } from './routes/rental.routes.js';
import { paymentRoutes } from './routes/payment.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { reviewRoutes } from './routes/review.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to RentNest API" });
});


app.use('/api/auth', authRoutes);
app.use('/api', publicPropertyRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route Not Found", errorDetails: {} });
});


app.use(globalErrorHandler);

export default app;