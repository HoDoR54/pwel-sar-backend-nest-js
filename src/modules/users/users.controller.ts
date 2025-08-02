import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './dto/users.res.dto';
import { UserRegisterReqDto, GetAllUsersQueryDto } from './dto/users.req.dto';
import {
  ApiPagination,
  Pagination,
} from 'src/lib/decorators/pagination.decorator';
import { PaginatedReqDto } from 'src/lib/dto/pagination.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return await this._usersService.findUser({ _id: id });
  }

  @Get()
  @ApiPagination()
  async getAll(
    @Pagination() pagination: PaginatedReqDto,
    @Query() query: GetAllUsersQueryDto,
  ): Promise<UserResponse[]> {
    return await this._usersService.getAll(pagination, query);
  }
}
