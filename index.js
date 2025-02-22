import express from 'express';

// Create an instance of Express
const app = express();

// Simple "Hello World" endpoint
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Export the handler for Netlify
export default async (req, res) => {
    app(req, res);
};


// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import helmet from 'helmet';
// import mongoose from 'mongoose';
// import articleRoutes from './src/routes/article.routes.js';
// import authRoutes from './src/routes/auth.routes.js';
// import clientRoutes from './src/routes/client.routes.js';
// import orderRoutes from './src/routes/order.routes.js';
// import projectRoutes from './src/routes/project.routes.js';
// import requestRoutes from './src/routes/request.routes.js';
// import taskRoutes from './src/routes/task.routes.js';
// import uploadRoutes from './src/routes/upload.routes.js';
// import userRoutes from './src/routes/user.routes.js';

// import { authenticateToken } from './src/middleware/auth.js';

// dotenv.config();

// const app = express();

// const corsOptions = {
//     origin: ["http://localhost:3000", "http://localhost"],
//     credentials: true,
//     exposedHeaders: ["set-cookie"],
// };

// app.use(cookieParser());
// app.use(helmet());
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/requests', authenticateToken, requestRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/upload', authenticateToken, uploadRoutes);

// // Error handling middleware
// app.use(errorHandler);

// // Export the handler for Netlify (Serverless function)
// export default async (req, res) => {
//     app(req, res);
// };
