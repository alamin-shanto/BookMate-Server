import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bookRoutes from "./routes/book.routes";
import borrowRoutes from "./routes/borrow.routes";

const app = express();

// Middlewares
app.use(helmet()); // security headers
app.use(cors()); // cross-origin access
app.use(express.json()); // JSON body parser
app.use(morgan("dev")); // request logging

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Server is running!" });
});

// Not found handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
