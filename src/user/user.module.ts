// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'DatabaseConnection'),
  ],
  providers: [UserService],
  exports: [UserService], 
})
export class UserModule {}
