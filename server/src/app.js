import express from "express";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import healthRouter from "./routes/health.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
