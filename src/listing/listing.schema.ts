import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Order } from 'src/order/order.schema';
import { User } from 'src/auth/user.schema';
import { ListingGender } from './listing-gender.enum';

@Schema()
export class Listing {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false })
  orderId: Order;

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

  @Prop({ required: true, enum: [ListingGender.male, ListingGender.female] })
  gender: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  placement: string;

  @Prop({ required: true, type: [Object] })
  images: Record<string, string>[];

  @Prop({ required: true, default: false })
  sold: boolean;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export type ListingDocument = Listing & mongoose.Document;

export const ListingSchema = SchemaFactory.createForClass(Listing);
