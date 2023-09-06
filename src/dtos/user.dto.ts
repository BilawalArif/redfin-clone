import { Role } from "src/enums/role.enum";

export interface UserDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  address: string;
  city: string;
  country: string;
  zip: number;
  role: Role;
  isVerified: boolean;
  verificationToken: string;
  // Other user properties
}
