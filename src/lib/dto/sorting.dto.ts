import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SortingReqDto {
  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({ type: String, default: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';
}
