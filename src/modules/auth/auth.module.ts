import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersMapper } from '../users/users.mapper';
import { UsersModule } from '../users/users.module';
import { UsersRepo } from '../users/users.repo';

@Module({
  providers: [AuthService, UsersService, UsersMapper, UsersRepo],
  controllers: [AuthController],
})
export class AuthModule {}
