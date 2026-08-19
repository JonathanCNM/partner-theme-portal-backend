import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import { requireAuth } from './middlewares/auth.js';
import partnerRoutes from './routes/partners.js';
import themeVersionRoutes from './routes/themeVersions.js';
import { getPublicTheme } from './controllers/partnerController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Theme Portal API is running' });
});

app.get('/api/public/themes/:partnerId', getPublicTheme);

// Modo desarrollo: deshabilitar autenticación
const DEV_MODE = process.env.NODE_ENV !== 'production';

if (DEV_MODE) {
  console.log('⚠️  DEV MODE: Authentication disabled');
  app.use('/api/partners', partnerRoutes);
  app.use('/api/theme-versions', themeVersionRoutes);
} else {
  app.use('/api/partners', requireAuth, partnerRoutes);
  app.use('/api/theme-versions', requireAuth, themeVersionRoutes);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
