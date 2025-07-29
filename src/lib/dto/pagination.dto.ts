import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
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
