import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

export type SortParams = {
  sortField: string;
  sortDirection: 1 | -1;
};

export function Sorting(options?: {
  allowedFields?: string[];
  fieldMap?: Record<string, string>;
}) {
  return createParamDecorator((_, context: ExecutionContext): SortParams => {
    const req: Request = context.switchToHttp().getRequest();

    const rawField = (req.query.sortBy as string) || 'updatedAt';
    const sortOrder = (req.query.sortOrder as string)?.toLowerCase() || 'desc';

    const allowed = options?.allowedFields || ['updatedAt'];

    if (!allowed.includes(rawField)) {
      throw new BadRequestException(
        `Invalid sortBy field: "${rawField}". Allowed: ${allowed.join(', ')}`,
      );
    }

    if (!['asc', 'desc'].includes(sortOrder)) {
      throw new BadRequestException(
        `Invalid sortOrder: "${sortOrder}". Must be "asc" or "desc".`,
      );
    }

    const fieldMap = options?.fieldMap || {};
    const sortField = fieldMap[rawField] || rawField;

    const dto: SortParams = {
      sortField,
      sortDirection: sortOrder === 'asc' ? 1 : -1,
    };
    return dto;
  })();
}

export function ApiSorting(allowedFields: string[] = []) {
  return applyDecorators(
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: allowedFields.length
        ? `One of: ${allowedFields.join(', ')}`
        : 'Sorting field',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['asc', 'desc'],
    }),
  );
}
