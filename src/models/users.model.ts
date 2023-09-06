import mongoose, { Document } from 'mongoose';
import { Role } from 'src/enums/role.enum';
import { UserSchema } from 'src/schemas/users.schema';

export interface User extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  address: string;
  city: string;
  country: string;
  zip: number;
  role: Role;
  isVerified: boolean;
  verificationToken: string;
  resetPasswordToken: string;
  resetPasswordTokenExpiry: number;
}

export const PropertyModel = mongoose.model<User>('User', UserSchema);
