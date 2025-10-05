import { Router } from "express";
import * as ctrl from "../controllers/borrow.controller";
const r = Router();
r.post("/:bookId", ctrl.borrowBook);
r.get("/summary", ctrl.borrowSummary);
export default r;
