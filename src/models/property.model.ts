import mongoose, { Document } from 'mongoose';
import { PropertySchema } from 'src/schemas/property.schema';
import { Comment } from '../schemas/comment.schema';

export interface Property extends Document {
  sold_date: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  price: number;
  beds: number;
  baths: number;
  square_feet: number;
  lot_size: number;
  year_built: number;
  days_on_market: number;
  monthly_hoa: number;
  mls_number: number;
  identifier: string;
  latitude: number;
  longitude: number;
  description: string;
  comments: Comment[];
  upvotes: number;
  downvotes: number;
  image_url: string; // New property to add

}

export const PropertyModel = mongoose.model<Property>(
  'Property',
  PropertySchema,
);
