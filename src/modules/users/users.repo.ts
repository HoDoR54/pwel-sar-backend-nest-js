import { Model } from 'mongoose';
import { AbstractRepo } from '../database/abstract.repo';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

export class UsersRepo extends AbstractRepo<User> {
  constructor(
    @InjectModel(User.name)
    protected readonly model: Model<User>,
  ) {
    super(model);
  }
}
