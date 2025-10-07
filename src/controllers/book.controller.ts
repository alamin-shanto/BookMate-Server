import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Book, { IBook } from "../models/book.model";
import ApiFeatures from "../utilities/apiFeatures";

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
    const features = new ApiFeatures(Book.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const books = await features.query;
    const total = await Book.countDocuments();

    res.status(200).json({
      success: true,
      total,
      count: books.length,
      data: books,
    });
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

    const book = await Book.create({
      ...payload,
      available: payload.copies ? payload.copies > 0 : true,
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// Get a Single Book by ID

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

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// Update a Book

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

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

/* 
   Delete a Book
*/
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
