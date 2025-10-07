import { Router } from "express";
import * as ctrl from "../controllers/borrow.controller";

const r = Router();

r.get("/summary", ctrl.borrowSummary);
r.post("/:bookId", ctrl.borrowBook);

export default r;
