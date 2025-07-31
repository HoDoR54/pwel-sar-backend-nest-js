import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersRepo } from '../users/users.repo';
import { Mapper } from 'src/lib/helpers/mappers';

@Module({
  providers: [AuthService, UsersService, UsersRepo, Mapper],
  controllers: [AuthController],
})
export class AuthModule {}
