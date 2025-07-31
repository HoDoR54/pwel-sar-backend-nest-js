import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  @Get('hello')
  getHello() {
    return 'Hello';
  }
}
