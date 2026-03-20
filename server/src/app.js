import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import careerPageRoutes from "./routes/careerPageRoutes.js";
import healthRouter from "./routes/health.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    }
  })
);

app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api", careerPageRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
