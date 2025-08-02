import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { PaginatedReqDto } from '../dto/pagination.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

export const Pagination = createParamDecorator(
  (_, context: ExecutionContext): PaginatedReqDto => {
    const req: Request = context.switchToHttp().getRequest();

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const size = req.query.size ? parseInt(req.query.size as string) : 10;

    if (isNaN(page) || page < 1 || isNaN(size) || size < 1) {
      throw new BadRequestException(
        'Invalid pagination params: page and size must be positive integers.',
      );
    }
    const dto = plainToInstance(PaginatedReqDto, { page, size });

    return dto;
  },
);

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'size', required: false, type: Number }),
  );
}
