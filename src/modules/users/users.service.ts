import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import { UserCreateReq } from './dto/users.req.dto';
import { UserResponse } from './dto/users.res.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly _usersRepo: UsersRepo) {}

  async createUser(req: UserCreateReq): Promise<UserResponse> {
    const hashed = await bcrypt.hash(req.password, 10);
    const createdUser = await this._usersRepo.createOne({
      ...req,
      password: hashed,
    });
    const mappedUser: UserResponse = {
      _id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      profileUrl: createdUser.profileUrl,
      bio: createdUser.bio,
    };
    return mappedUser;
  }
}
