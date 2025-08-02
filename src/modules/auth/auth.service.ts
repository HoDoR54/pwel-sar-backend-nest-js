import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  UserRegisterReqDto,
  UserLoginReqDto,
} from '../users/dto/users.req.dto';
import { UserResponse } from '../users/dto/users.res.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async registerUserAsync(
    req: UserRegisterReqDto,
  ): Promise<{
    user: UserResponse;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // TO-DO: validate request credentials
    // const isValid = await this._usersService.validateRegisterCredentials(req)

    const hashed = await bcrypt.hash(req.password, 10);
    const user = await this._usersService.createUser({
      ...req,
      password: hashed,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user._id, user.email);

    return { user, tokens };
  }

  async login(
    req: UserLoginReqDto,
  ): Promise<{
    user: UserResponse;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const { email, password } = req;

    // check if the user exists
    const matchedUser = await this._usersService.findUser({ email: email });

    // check if the password is correct
    const hashed = await this._usersService.getHashedByEmail(matchedUser.email);
    const isMatched = await bcrypt.compare(password, hashed);
    if (!isMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(
      matchedUser._id,
      matchedUser.email,
    );

    return { user: matchedUser, tokens };
  }

  // TO-DO: authenticate method that validates access_token

  async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, username: email };

    const accessToken = await this._jwtService.signAsync(payload, {
      expiresIn: '15m', // Short-lived access token
    });

    const refreshToken = await this._jwtService.signAsync(payload, {
      expiresIn: '7d', // Long-lived refresh token
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this._jwtService.verifyAsync(refreshToken);

      // Verify user still exists
      const user = await this._usersService.findUser({ _id: payload.sub });

      // Generate new tokens
      return await this.generateTokens(user._id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
