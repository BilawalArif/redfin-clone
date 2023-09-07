import * as mongoose from 'mongoose';
import { Role } from 'src/enums/role.enum';
export const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role), // Use the values from the Role enum
      default: Role.User, // Default role if not specified
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Number,
  },
  { timestamps: true },
);

export interface User extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  address: number;
  city: string;
  country: string;
  zip: number;
  role: Role;
  isVerified: boolean;
  verificationToken: string;
  resetPasswordToken: string;
  resetPasswordTokenExpiry: number;
}
