import express from "express";
import mongoose from "mongoose";
import bookRoutes from "./routes/book.routes";
import borrowRoutes from "./routes/borrow.routes";

const app = express();
app.use(express.json());
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

/* basic error handler */
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

export default app;
