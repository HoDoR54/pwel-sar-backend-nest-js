import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

export class CookieHelper {
  static setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    config: ConfigService,
  ): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: (config.get<string>('NODE_ENV') as string) === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
