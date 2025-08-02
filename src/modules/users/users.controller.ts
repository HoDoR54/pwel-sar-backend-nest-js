import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './dto/users.res.dto';
import {
  UserRegisterReqDto,
  GetAllUsersQueryDto,
  userSortingFields,
} from './dto/users.req.dto';
import {
  ApiPagination,
  Pagination,
} from 'src/lib/decorators/pagination.decorator';
import { PaginatedReqDto, PaginatedResDto } from 'src/lib/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiOperation } from '@nestjs/swagger';
import {
  ApiSorting,
  Sorting,
  SortParams,
} from 'src/lib/decorators/sorting.decorator';
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @ApiOperation({ summary: 'Get a user by id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return await this._usersService.findUser({ _id: id });
  }

  @ApiOperation({ summary: 'Get all users with pagination' })
  @Get()
  @ApiPagination()
  @ApiSorting(userSortingFields.allowedFields)
  async getAll(
    @Pagination() pagination: PaginatedReqDto,
    @Sorting(userSortingFields) sorting: SortParams,
    @Query() query: GetAllUsersQueryDto,
  ): Promise<PaginatedResDto<UserResponse>> {
    return await this._usersService.getAll(pagination, sorting, query);
  }
}
