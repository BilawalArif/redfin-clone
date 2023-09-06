import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';
import { User } from 'src/models/users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUser(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserRole(userId: string): Promise<string | undefined> {
    // Logic to fetch user's role based on userId
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.role;
  }

  async verifyAccessToken(token: string): Promise<string> {
    const { userId = '' } = await this.jwtService.verifyAsync(token);
    return userId || '';
  }

  private validateUserAccess(user: User, userId: string): boolean {
    return userId == user._id.toString();
  }

  private async updateUser(user: User, userData: UpdateUserDto): Promise<void> {
    user.firstName = userData.firstName;
  }

  private async saveUser(user: User): Promise<User> {
    return user.save();
  }

  async updateUserData(userId: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // user validation
    this.validateUserAccess(user, userId);
    // updating user
    this.updateUser(user, userData);
    // store user data
    return this.saveUser(user);
  }
}
