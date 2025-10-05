import { Router } from "express";
import * as ctrl from "../controllers/book.controller";
const r = Router();
r.get("/", ctrl.listBooks);
r.post("/", ctrl.createBook);
r.get("/:id", ctrl.getBook);
r.put("/:id", ctrl.updateBook);
r.delete("/:id", ctrl.deleteBook);
export default r;
