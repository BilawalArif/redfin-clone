import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { jwtGuard } from '../guards/jwt.auth.guard';
import { RoleGuard } from '../guards/roles.auth.guard';
import { RefreshJwtGuard } from '../guards/refreshJwt.auth.guard';
import { TokenService } from 'src/utils/generateToken';
import { GoogleStrategy } from '../strategies/google.strategy';
import { VerifyAccountMailService } from './mails/verifyAccount.mail.service';
import { ResetPasswordMailService } from './mails/resetPassword.mail.service';
import { UserSchema } from 'src/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    UsersService,
    TokenService,
    VerifyAccountMailService,
    ResetPasswordMailService,
    {
      provide: APP_GUARD,
      useClass: jwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RefreshJwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
