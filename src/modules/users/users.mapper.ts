import { UserResponse } from './dto/users.res.dto';
import { User } from './user.schema';

export class UsersMapper {
  documentToResponse = (model: User): UserResponse => {
    const mapped: UserResponse = {
      _id: model._id.toString(),
      name: model.name,
      email: model.email,
      profileUrl: model.profileUrl,
      bio: model.bio,
    };

    return mapped;
  };
}
