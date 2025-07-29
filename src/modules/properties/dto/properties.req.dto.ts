import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  PropertyStatus,
  PaymentType,
} from '../../database/enums';
import { PaginationDto } from 'src/lib/dto/pagination.dto';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAddressReqDto {
  @ApiProperty({
    type: [Number],
    description: 'Coordinates as [longitude, latitude]',
    example: [96.1561, 16.8661],
  })
  @IsArray()
  @Length(2, 2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  floor?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  township: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  stateOrRegion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  postalCode: string;
}

export class CreatePropertyReqDto {
  @ApiPropertyOptional({ type: [String] })
  imageUrls?: string[];

  @ApiProperty({ enum: PropertyType })
  type: PropertyType;

  @ApiPropertyOptional({ type: String })
  owner?: string;

  @ApiPropertyOptional({
    enum: PropertyStatus,
    default: PropertyStatus.Available,
  })
  status: PropertyStatus;

  @ApiPropertyOptional()
  areaInMeterSquared?: number;

  @ApiPropertyOptional()
  bedrooms?: number;

  @ApiPropertyOptional()
  bathrooms?: number;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional({ enum: PaymentType, default: PaymentType.BankTransfer })
  preferredPaymentType: PaymentType;

  @ApiProperty({ type: CreateAddressReqDto })
  address: CreateAddressReqDto;
}

export class GetAllPropertiesQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PropertyType })
  type?: PropertyType;

  @ApiPropertyOptional({ enum: PropertyStatus })
  status?: PropertyStatus;

  @ApiPropertyOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  township?: string;
}
