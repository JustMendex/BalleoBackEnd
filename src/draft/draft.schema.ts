import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/user.schema';
import { DraftGender } from './draft-gender.enum';
import { DraftStatus } from './draft-status.enum';

@Schema()
export class Draft {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  style: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: [DraftGender.male, DraftGender.female] })
  gender: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, default: DraftStatus.pending })
  status: string;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  pickUpDate: Date;

  @Prop({ required: true, type: [Object] })
  images: Record<string, string>[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export type DraftDocument = Draft & mongoose.Document;

export const DraftSchema = SchemaFactory.createForClass(Draft);
