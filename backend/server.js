// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [];
if (process.env.NODE_ENV === 'development' && process.env.CLIENT_URL_DEV) {
  allowedOrigins.push(process.env.CLIENT_URL_DEV);
}
if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL_PROD) {
  allowedOrigins.push(process.env.CLIENT_URL_PROD);
}

if (allowedOrigins.length === 0) {
  console.warn("CORS: No CLIENT_URL_DEV or CLIENT_URL_PROD set in .env. Allowing all origins for now (unsafe for production).");
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', userRoutes);
app.use('/api/stations', stationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});