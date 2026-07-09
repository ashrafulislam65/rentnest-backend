import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import { publicPropertyRoutes } from './routes/property.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { landlordRoutes } from './routes/landlord.routes.js';
import { rentalRoutes } from './routes/rental.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

// ১. Base Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to RentNest API" });
});

// ২. Application Routes (সব মেইন রাউট ৪০৪ এবং গ্লোবাল এরর হ্যান্ডলারের ওপরে থাকবে)
app.use('/api/auth', authRoutes);
app.use('/api', publicPropertyRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/rentals', rentalRoutes);

// ৩. 404 Route Handling (রাউট খুঁজে না পেলে এটি ট্রিগার হবে)
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route Not Found", errorDetails: {} });
});

// ৪. Global Error Handler (একদম শেষে থাকবে যাতে যেকোনো জায়গা থেকে next(err) দিলে এখানে আসে)
app.use(globalErrorHandler);

export default app;