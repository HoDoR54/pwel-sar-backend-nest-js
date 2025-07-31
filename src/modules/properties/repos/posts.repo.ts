import { AbstractRepo } from 'src/modules/database/abstract.repo';
import { Post } from '../schemas/posts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class PostsRepo extends AbstractRepo<Post> {
  constructor(@InjectModel(Post.name) readonly model: Model<Post>) {
    super(model);
  }
}
