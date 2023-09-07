import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { User } from 'src/models/users.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/utils/generateToken';
import { VerifyAccountMailService } from './mails/verifyAccount.mail.service';
import { ResetPasswordMailService } from './mails/resetPassword.mail.service';
import { AllExceptionsFilter } from 'src/utils/error.filter';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    private tokenService: TokenService,
    private verifyAccountMailService: VerifyAccountMailService,
    private resetPasswordMailService: ResetPasswordMailService,
  ) {}

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async createAndSaveUser(userDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(userDto);

      return createdUser.save();
    } catch (error) {
      throw new AllExceptionsFilter(error);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(createUserDto.password);

      const createdUser = await this.createAndSaveUser({
        ...createUserDto,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      console.log(
        '🚀 ~ file: auth.service.ts:52 ~ AuthService ~ createUser ~ error:',
        error,
      );
      throw new AllExceptionsFilter(error);
    }
  }

  private async createGoogleUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { isVerified } = createUserDto;
      const verified = !isVerified;
      const hashedPassword = await this.hashPassword(createUserDto.password);

      return new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        isVerified: verified,
      });
    } catch (error) {
      throw new AllExceptionsFilter(error);
    }
  }

  async getUser(email: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotAcceptableException('Could not find the user');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async comparePassword(
    password: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const passwordValid = await bcrypt.compare(password, newPassword);
      return passwordValid;
    } catch (error) {
      throw new AllExceptionsFilter(error);
    }
  }

  async saveGoogleUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.createGoogleUser(createUserDto);

    try {
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error('Failed to save user');
    }
  }

  async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    googleAuthToken: any;
  }> {
    try {
      const accessToken = await this.tokenService.generateAccessToken(
        user?._id,
        user?.email,
        user?.role,
      );
      const refreshToken = await this.tokenService.generateRefreshToken(
        user?._id,
        user?.email,
        user?.role,
      );
      const googleAuthToken = await this.tokenService.generateGoogleLoginToken(
        user ? user : undefined,
      );

      return { accessToken, refreshToken, googleAuthToken };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  setAuthorizationHeader(res: Response, token: string): void {
    res.set('authorization', token);
  }

  sendSignupResponse(res: Response, user: User): void {
    res.status(200).json({
      user,
      message: 'User created. Check your email for verification.',
    });
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken =
      await this.tokenService.generateVerificationToken(user);
    await this.verifyAccountMailService.verificationEmail(
      user.email,
      verificationToken,
    );
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const resetPasswordToken =
        await this.tokenService.generateResetPasswordToken(user);
      await this.resetPasswordMailService.passwordResetEmail(
        user.email,
        resetPasswordToken,
      );
    }
  }
}
export interface IAuthService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  getUser(email: string): Promise<User | undefined>;
  comparePassword(password: string, newPassword: string): Promise<boolean>;
}
