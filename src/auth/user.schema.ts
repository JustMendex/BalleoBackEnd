import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, default: '' })
  displayName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  salt: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ required: true, default: 'user' })
  userType: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: '' })
  rib: string;

  @Prop({ required: true, default: '' })
  address: string;

  @Prop({ required: true, default: NaN })
  phoneNumber: number;

  @Prop({ required: true, default: '' })
  city: string;

  @Prop({ required: true, default: '' })
  zipCode: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);
