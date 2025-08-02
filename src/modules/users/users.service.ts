import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import {
  UserRegisterReqDto,
  GetAllUsersQueryDto,
  GetUserDto,
} from './dto/users.req.dto';
import { UserResponse } from './dto/users.res.dto';
import * as bcrypt from 'bcrypt';
import { Pagination } from 'src/lib/decorators/pagination.decorator';
import { PaginatedReqDto, PaginatedResDto } from 'src/lib/dto/pagination.dto';
import { Mapper } from 'src/lib/helpers/mappers';
import { SortParams } from 'src/lib/decorators/sorting.decorator';

@Injectable()
export class UsersService {
  constructor(
    private readonly _usersRepo: UsersRepo,
    private readonly _mapper: Mapper,
  ) {}

  async createUser(req: UserRegisterReqDto): Promise<UserResponse> {
    const createdUser = await this._usersRepo.createOne(req);
    return this._mapper.userDocumentToResponse(createdUser);
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
    return this._mapper.userDocumentToResponse(match);
  }

  async getAll(
    pagination: PaginatedReqDto,
    sorting: SortParams,
    filter: GetAllUsersQueryDto,
  ): Promise<PaginatedResDto<UserResponse>> {
    // create a filter object with the request query
    const { page, size } = pagination;
    const { sortField, sortDirection } = sorting;
    const query: any = {};
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
      ];
    }

    // call repo method with pagination
    const users = await this._usersRepo.getMany(query, {
      skip: pagination.skip,
      limit: pagination.limit,
      sort: { [sortField]: sortDirection },
    });

    return {
      items: users.map((u) => this._mapper.userDocumentToResponse(u)),
      totalItems: await this._usersRepo.count(query),
      totalPages: Math.ceil(
        (await this._usersRepo.count(query)) / pagination.limit,
      ),
      currentPage: page || 1,
      pageSize: size || pagination.limit,
    };
  }
}
