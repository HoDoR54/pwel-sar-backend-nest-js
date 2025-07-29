import { Module } from '@nestjs/common';
import { AuthModule } from './auth/admin-auth.module';

@Module({
  imports: [AuthModule],
})
export class AdminModule {}
