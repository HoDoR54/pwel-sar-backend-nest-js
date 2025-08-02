import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractSchema } from 'src/modules/database/abstract.schema';
import {
  PosterType,
  ApprovalStatus,
  PostType,
} from 'src/modules/database/enums';

@Schema({ timestamps: true })
export class Post extends AbstractSchema {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Property' })
  property: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  postedBy: Types.ObjectId;

  @Prop({ enum: PosterType, default: PosterType.Owner })
  posterType: PosterType;

  @Prop({ enum: PostType, required: true })
  postType: PostType;

  @Prop({ enum: ApprovalStatus, default: ApprovalStatus.Pending })
  status: ApprovalStatus;

  @Prop({ required: false })
  rejectionReason?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
