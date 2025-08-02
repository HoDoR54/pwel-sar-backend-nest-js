import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepo } from './users.repo';
import { Mapper } from 'src/lib/helpers/mappers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, Mapper],
  exports: [UsersService, UsersRepo],
  imports: [JwtModule],
})
export class UsersModule {}
