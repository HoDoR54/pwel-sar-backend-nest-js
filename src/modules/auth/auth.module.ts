import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Mapper } from 'src/lib/helpers/mappers';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [AuthService, Mapper],
  controllers: [AuthController],
  imports: [UsersModule],
})
export class AuthModule {}
