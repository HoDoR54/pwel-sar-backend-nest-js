import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateReq } from './dto/users.req.dto';
import { UserResponse } from './dto/users.res.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post()
  async create(@Body() data: UserCreateReq): Promise<UserResponse> {
    return await this._usersService.createUser(data);
  }
}
