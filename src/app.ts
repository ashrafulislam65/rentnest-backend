import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to RentNest API" });
});

// Global Error Handler
app.use(globalErrorHandler);

// 404 Route Handling
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route Not Found", errorDetails: {} });
});

export default app;