import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import ServerlessHttp from 'serverless-http';


import cookieParser from 'cookie-parser';
import errorHandler from '../../src/middleware/errorHandler.js';

dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
};

// Middleware setup
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));



app.get('/.netlify/functions/api', (req, res) => {
    return res.json({
        messages: "hello world!"
    })
})

app.use('/.netlify/functions/api/tasks', taskRoutes);


// Set up routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/requests', authenticateToken, requestRoutes);
// app.use('/api/clients', clientRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/upload', authenticateToken, uploadRoutes);

// Error handling
app.use(errorHandler);

// Convert Express app to serverless handler
const handler = ServerlessHttp(app);

// Export handler for Netlify
module.exports.handler = async (event, context) => {
    const result = await handler(event, context);
    return result;
}
