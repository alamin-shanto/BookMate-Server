import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Book, { IBook } from "../models/book.model";

// Typed payload for create/update
type BookPayload = Partial<
  Pick<
    IBook,
    | "title"
    | "author"
    | "genre"
    | "isbn"
    | "description"
    | "copies"
    | "available"
  >
>;

// Helper: validate MongoDB ObjectId
const isValidId = (id: string | undefined) =>
  !!id && mongoose.Types.ObjectId.isValid(id);

/* GET list with pagination and optional filters */
export const listBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.author) query.author = req.query.author;

    const [items, total] = await Promise.all([
      Book.find(query).skip(skip).limit(limit).lean(),
      Book.countDocuments(query),
    ]);

    res.json({ success: true, data: { items, total, page, limit } });
  } catch (err) {
    next(err);
  }
};

/* Create a book */
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload: BookPayload = req.body;

    if (!payload.title || !payload.author) {
      return res.status(400).json({
        success: false,
        message: "Title and author are required",
      });
    }

    // Set availability automatically
    const book = await Book.create({
      ...payload,
      available: payload.copies ? payload.copies > 0 : true,
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

/* Get a single book */
export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid book ID" });

    const book = await Book.findById(id);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });

    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

/* Update a book */
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid book ID" });

    const payload: BookPayload = req.body;

    // Automatically update availability based on copies
    if (payload.copies !== undefined) {
      payload.available = payload.copies > 0;
    }

    const book = await Book.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });

    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

/* Delete a book */
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid book ID" });

    const book = await Book.findByIdAndDelete(id);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
