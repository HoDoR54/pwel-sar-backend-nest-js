import { Module } from '@nestjs/common';
import { AuthController } from './admin-auth.controller';
import { AuthService } from './admin-auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
