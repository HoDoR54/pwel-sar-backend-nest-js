import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginatedReqDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsInt()
  @IsOptional()
  @Min(1)
  size?: number;

  get limit(): number {
    return this.size || 10;
  }

  get skip(): number {
    return this.page && this.size ? (this.page - 1) * this.size : 0;
  }
}

export class PaginatedResDto<T> {
  @ApiProperty({ type: [Object] })
  items: T[];

  @ApiProperty({ type: Number })
  totalItems: number;

  @ApiProperty({ type: Number })
  totalPages: number;

  @ApiProperty({ type: Number })
  currentPage: number;

  @ApiProperty({ type: Number })
  pageSize: number;
}
