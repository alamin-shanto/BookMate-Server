import { Schema, model, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre?: string;
  isbn?: string;
  description?: string;
  copies: number;
  available: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: String,
    isbn: { type: String, index: true },
    description: String,
    copies: { type: Number, default: 1, min: 0 },
    available: { type: Boolean, default: true },
    image: { type: String },
  },
  { timestamps: true }
);

BookSchema.pre("save", function (next) {
  this.available = this.copies > 0;
  next();
});

export default model<IBook>("Book", BookSchema);
