import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '../../database/abstract.schema';
import { Types } from 'mongoose';
import {
  PaymentType,
  AvailabilityStatus,
  PropertyType,
} from '../../database/enums';

@Schema({ timestamps: true })
export class Property extends AbstractSchema {
  @Prop()
  imageUrls?: string[];

  @Prop({ enum: PropertyType, required: true })
  type: PropertyType;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  owner: Types.ObjectId;

  @Prop({ enum: AvailabilityStatus, default: AvailabilityStatus.Available })
  status: AvailabilityStatus;

  @Prop()
  areaInMeterSquared?: number;

  @Prop()
  bedrooms?: number;

  @Prop()
  bathrooms?: number;

  @Prop({ required: true })
  price: number;

  @Prop({ enum: PaymentType, default: PaymentType.BankTransfer })
  preferredPaymentType: PaymentType;

  @Prop({ type: Types.ObjectId, ref: 'Address' })
  address?: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
