import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepo } from './users.repo';
import { UsersMapper } from './users.mapper';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, UsersMapper],
})
export class UsersModule {}
