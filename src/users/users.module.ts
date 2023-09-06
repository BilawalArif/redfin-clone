import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from 'src/schemas/users.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]), ],
  controllers: [UsersController],
  providers: [UsersService, ],
  exports: [UsersService],
})
export class UsersModule {}
