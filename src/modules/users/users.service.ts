import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import {
  CreateUserReq,
  GetAllUsersQueryDto,
  GetUserDto,
} from './dto/users.req.dto';
import { UserResponse } from './dto/users.res.dto';
import * as bcrypt from 'bcrypt';
import { UsersMapper } from './users.mapper';
import { Pagination } from 'src/lib/decorators/pagination.decorator';
import { PaginationDto } from 'src/lib/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly _usersRepo: UsersRepo,
    private readonly _usersMapper: UsersMapper,
  ) {}

  async createUser(req: CreateUserReq): Promise<UserResponse> {
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

  async getHashedByEmail(email: string): Promise<string> {
    return (await this._usersRepo.getOneOrThrow({ email: email })).password;
  }

  async findUser(userToFind: GetUserDto): Promise<UserResponse> {
    const { _id, email } = userToFind;

    const filter: any = {};
    if (_id) filter._id = _id;
    else if (email) filter.email = email;
    else throw new Error('Either _id or email must be provided');

    const match = await this._usersRepo.getOneOrThrow(filter);
    return this._usersMapper.documentToResponse(match);
  }

  async getAll(
    pagination: PaginationDto,
    query: GetAllUsersQueryDto,
  ): Promise<UserResponse[]> {
    const filterQuery: any = {};

    if (query.search) {
      filterQuery.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const users = await this._usersRepo.getMany(filterQuery, {
      skip: pagination.skip,
      limit: pagination.limit,
    });

    return users.map((u) => this._usersMapper.documentToResponse(u));
  }
}
