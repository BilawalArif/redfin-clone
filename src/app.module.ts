import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { PropertyModule } from './property/property.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertySchema } from './schemas/property.schema';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PropertyModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
