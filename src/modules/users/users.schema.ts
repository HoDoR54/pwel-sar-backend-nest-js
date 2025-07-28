import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractSchema } from '../database/abstract.schema';

@Schema({ timestamps: true })
export class User extends AbstractSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  profileUrl?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
