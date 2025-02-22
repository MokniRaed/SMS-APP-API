import express from 'express'; // Make sure this line is at the top

// import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { authenticateToken } from './src/middlewares/auth.js';
import errorHandler from './src/middlewares/errorHandler.js';

import articleRoutes from './src/routes/article.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import requestRoutes from './src/routes/request.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import userRoutes from './src/routes/user.routes.js';

dotenv.config();

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
};

app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/requests', authenticateToken, requestRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);

// Error handling middleware
app.use(errorHandler);

// Exporting the handler for Vercel
// export default (req, res) => {
//   app(req, res);
// };

// const app = express();


// // Simple "Hello World" endpoint
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// Exporting the Express app for Vercel
export default (req, res) => {
    app(req, res);
};