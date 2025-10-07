import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Book from "../models/book.model";
import Borrow from "../models/borrow.model";

type BorrowPayload = {
  quantity: number;
  dueDate: string;
};

const isValidId = (id: string | undefined) =>
  !!id && mongoose.Types.ObjectId.isValid(id);

/* Borrow a book */
export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bookId } = req.params;
  if (!isValidId(bookId)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  const { quantity, dueDate }: BorrowPayload = req.body;

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid quantity" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findById(bookId).session(session);
    if (!book) {
      throw new Error("Book not found");
    }
    if (quantity > book.copies) {
      throw new Error("Not enough copies available");
    }

    // Decrease copies and set availability
    book.copies -= quantity;
    book.available = book.copies > 0;
    await book.save({ session });

    // Record the borrow transaction
    const borrowRecord = await Borrow.create(
      [
        {
          book: book._id,
          quantity,
          dueDate,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord[0],
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

/* Aggregation for borrow summary */
export const borrowSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await Borrow.aggregate([
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
          _id: 0,
          bookId: "$book._id",
          title: "$book.title",
          isbn: "$book.isbn",
          totalQuantity: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};
