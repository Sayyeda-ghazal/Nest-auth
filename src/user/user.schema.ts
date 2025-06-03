// src/user/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Add OTP and expiry properties
  @Prop()
  resetOtp?: string;

  @Prop()
  resetOtpExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
