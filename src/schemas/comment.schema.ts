// comment.schema.ts
import { Schema, Document } from 'mongoose';

export interface Comment extends Document {
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema<Comment>(
  {
    comment: String,
  },
  { timestamps: true },
);
