import { Schema, model, Document, Types } from "mongoose";
import { IBook } from "./book.model";

export interface IBorrow extends Document {
  book: Types.ObjectId | IBook;
  borrowerName: string;
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  returned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    borrowerName: { type: String, required: true },
    borrowedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnedAt: { type: Date },
    returned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BorrowSchema.pre("save", function (next) {
  if (this.returnedAt) {
    this.returned = true;
  }
  next();
});

export default model<IBorrow>("Borrow", BorrowSchema);
