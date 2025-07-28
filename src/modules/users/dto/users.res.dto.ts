import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UserResponse {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  profileUrl?: string;

  @ApiProperty()
  @IsString()
  bio?: string;
}
