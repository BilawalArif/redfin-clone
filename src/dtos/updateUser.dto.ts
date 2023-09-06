import { IsString, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsInt()
  age: number;

  //   @IsString()
  //   email: string;

  @IsString()
  password: string;

  @IsInt()
  phoneNumber: number;

  //   @IsString()
  //   role: Role;

  //   isVerified: boolean;
}
