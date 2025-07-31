import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepo } from './users.repo';
import { Mapper } from 'src/lib/helpers/mappers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, Mapper],
})
export class UsersModule {}
