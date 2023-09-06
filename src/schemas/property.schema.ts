import * as mongoose from 'mongoose';
import { CommentSchema } from './comment.schema';

export const PropertySchema = new mongoose.Schema({
  sold_date: String,
  property_type: String,
  address: String,
  city: String,
  state: String,
  zip: Number,
  price: Number,
  beds: Number,
  baths: Number,
  square_feet: Number,
  lot_size: Number,
  year_built: Number,
  days_on_market: Number,
  monthly_hoa: Number,
  mls_number: Number,
  identifier: String,
  latitude: Number,
  longitude: Number,
  description: String,
  comments: [CommentSchema],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});
