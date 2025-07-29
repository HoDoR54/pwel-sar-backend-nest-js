import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterReq, LoginReq } from '../users/dto/users.req.dto';
import { UserResponse } from '../users/dto/users.res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  async register(@Body() req: RegisterReq): Promise<UserResponse> {
    return await this._authService.registerUserAsync(req);
  }

  @Post('login')
  async login(@Body() req: LoginReq): Promise<UserResponse> {
    return await this._authService.login(req);
  }
}
