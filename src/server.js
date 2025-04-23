import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import articleRoutes from "./routes/article.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import clientRoutes from "./routes/client.routes.js";
import collaboratorRoutes from "./routes/collaborator.routes.js";
import orderRoutes from "./routes/order.routes.js";
import projectRoutes from "./routes/project.routes.js";
import requestRoutes from "./routes/request.routes.js";
import taskRoutes from "./routes/task.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";

import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost",
    "http://91.232.4.44:5000",
    "http://91.232.4.44",
  ],

  credentials: true,
  exposedHeaders: ["set-cookie"],
};

// Use cookie-parser to parse cookies
app.use(cookieParser());
// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to log path and time
app.use((req, res, next) => {
  const timestamp = new Date().toISOString(); // Get current time
  console.log(`[${timestamp}] ${req.method} ${req.path}`); // Log method, path, and time
  next(); // Move to the next middleware/route
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/requests", requestRoutes);
app.use("/api/collaborators", collaboratorRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", authenticateToken, uploadRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export default app;

// // For vercel Use
// export default (req, res) => {
//   app(req, res); // This is what Vercel needs, it calls the Express app
// };

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });
