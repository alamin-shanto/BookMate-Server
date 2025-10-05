import { Request, Response } from "express";
import mongoose from "mongoose";
import Book, { IBook } from "../models/book.model";
import Borrow, { IBorrow } from "../models/borrow.model";

// Typed payload for borrowing
type BorrowPayload = {
  quantity: number;
  dueDate: string; // or Date if you convert later
};

// Helper: validate MongoDB ObjectId
const isValidId = (id: string | undefined) =>
  !!id && mongoose.Types.ObjectId.isValid(id);

/* Borrow a book */
export const borrowBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  if (!isValidId(bookId)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  const { quantity, dueDate }: BorrowPayload = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findById(bookId).session(session);
    if (!book) throw new Error("Book not found");
    if (quantity > book.copies) throw new Error("Not enough copies");

    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save({ session });

    const borrow = await Borrow.create(
      [{ book: book._id, quantity, dueDate }],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(borrow[0]);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: (err as Error).message });
  } finally {
    session.endSession();
  }
};

/* Aggregation for borrow summary */
export const borrowSummary = async (_req: Request, res: Response) => {
  try {
    const agg = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          title: "$book.title",
          isbn: "$book.isbn",
          totalQuantity: 1,
        },
      },
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
