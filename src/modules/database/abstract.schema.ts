import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export abstract class AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
