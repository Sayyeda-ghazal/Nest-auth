// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'DatabaseConnection')
    private readonly userModel: Model<User>,
  ) {}

  async save(user: Partial<User>) {
    const created = new this.userModel(user);
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async ValidateUserbyId(userId){
    const user = await this.userModel.findById(userId)
    if(!user){
        throw new NotFoundException("User not found")
    }
    return user;
  }
}
