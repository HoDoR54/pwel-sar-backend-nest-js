import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractSchema } from 'src/modules/database/abstract.schema';

@Schema({ timestamps: true })
export class Address extends AbstractSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Property' })
  property: Types.ObjectId;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ trim: true })
  fullAddress: string;

  @Prop({ trim: true })
  floor?: string;

  @Prop({ trim: true })
  street: string;

  @Prop({ trim: true })
  township: string;

  @Prop({ trim: true })
  district: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  stateOrRegion: string;

  @Prop({ trim: true })
  postalCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
