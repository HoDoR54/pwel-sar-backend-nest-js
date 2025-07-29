import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserReq, LoginReq } from '../users/dto/users.req.dto';
import { UserResponse } from '../users/dto/users.res.dto';
import { UsersService } from '../users/users.service';
import { UsersRepo } from '../users/users.repo';
import { UsersMapper } from '../users/users.mapper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly _usersService: UsersService) {}

  async registerUserAsync(req: CreateUserReq): Promise<UserResponse> {
    // TO-DO: validate request credentials

    const hashed = await bcrypt.hash(req.password, 10);
    return await this._usersService.createUser({ ...req, password: hashed });
  }

  async login(req: LoginReq): Promise<UserResponse> {
    const { email, password } = req;

    const matchedUser = await this._usersService.findUser({ email: email });
    const hashed = await this._usersService.getHashedByEmail(matchedUser.email);
    const isMatched = await bcrypt.compare(password, hashed);
    if (!isMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return matchedUser;
  }
}
