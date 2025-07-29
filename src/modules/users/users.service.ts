import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import {
  RegisterReq,
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

  async createUser(req: RegisterReq): Promise<UserResponse> {
    const createdUser = await this._usersRepo.createOne(req);
    return this._usersMapper.documentToResponse(createdUser);
  }

  async getHashedByEmail(email: string): Promise<string> {
    return (await this._usersRepo.getOneOrThrow({ email: email })).password;
  }

  async findUser(userToFind: GetUserDto): Promise<UserResponse> {
    // id or email
    const { _id, email } = userToFind;
    const filter: any = {};
    if (_id) filter._id = _id;
    else if (email) filter.email = email;

    const match = await this._usersRepo.getOneOrThrow(filter);
    return this._usersMapper.documentToResponse(match);
  }

  async getAll(
    pagination: PaginationDto,
    query: GetAllUsersQueryDto,
  ): Promise<UserResponse[]> {
    // create a filter object with the request query
    const filterQuery: any = {};
    if (query.search) {
      filterQuery.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    // call repo method with pagination
    const users = await this._usersRepo.getMany(filterQuery, {
      skip: pagination.skip,
      limit: pagination.limit,
    });

    return users.map((u) => this._usersMapper.documentToResponse(u));
  }
}
