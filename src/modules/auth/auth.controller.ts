import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterReqDto,
  UserLoginReqDto,
} from '../users/dto/users.req.dto';
import { UserResponse } from '../users/dto/users.res.dto';
import { Response, Request } from 'express';
import { CookieHelper } from 'src/lib/helpers/cookie.helper';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _config: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body() req: UserRegisterReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    const { user, tokens } = await this._authService.registerUserAsync(req);
    CookieHelper.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      this._config,
    );
    return user;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body() req: UserLoginReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    const { user, tokens } = await this._authService.login(req);
    CookieHelper.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      this._config,
    );
    return user;
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token using refresh token from cookies',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this._authService.refreshTokens(refreshToken);

    CookieHelper.setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      this._config,
    );

    return { message: 'Tokens refreshed successfully' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user by clearing authentication cookies' })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    CookieHelper.clearAuthCookies(res);
    return { message: 'Logged out successfully' };
  }
}
