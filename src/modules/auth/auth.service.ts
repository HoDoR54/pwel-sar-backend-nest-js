import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  UserRegisterReqDto,
  UserLoginReqDto,
} from '../users/dto/users.req.dto';
import { UserResponse } from '../users/dto/users.res.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly _usersService: UsersService) {}

  async registerUserAsync(req: UserRegisterReqDto): Promise<UserResponse> {
    // TO-DO: validate request credentials
    // const isValid = await this._usersService.validateRegisterCredentials(req)

    const hashed = await bcrypt.hash(req.password, 10);
    return await this._usersService.createUser({ ...req, password: hashed });
  }

  async login(req: UserLoginReqDto): Promise<UserResponse> {
    const { email, password } = req;

    // check if the user exists
    const matchedUser = await this._usersService.findUser({ email: email });

    // check if the password is correct
    const hashed = await this._usersService.getHashedByEmail(matchedUser.email);
    const isMatched = await bcrypt.compare(password, hashed);
    if (!isMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }

    // return
    return matchedUser;
  }

  // TO-DO: authenticate method that validates access_token
}
