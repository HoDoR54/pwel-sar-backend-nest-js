import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  PropertyStatus,
  PaymentType,
  PosterType,
  PostType,
  PostStatus,
} from '../../database/enums';
import { PaginationDto } from 'src/lib/dto/pagination.dto';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';

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
  @IsArray()
  @IsOptional()
  imageUrls?: string[];

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiPropertyOptional({ type: String })
  @IsString()
  owner?: string;

  @ApiPropertyOptional({
    enum: PropertyStatus,
    default: PropertyStatus.Available,
  })
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  areaInMeterSquared?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ enum: PaymentType, default: PaymentType.BankTransfer })
  @IsEnum(PaymentType)
  @IsOptional()
  preferredPaymentType: PaymentType;

  @ApiProperty({ type: CreateAddressReqDto })
  address: CreateAddressReqDto;
}

export class GetAllPropertiesQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  township?: string;
}

export class CreatePostReqDto {
  @ApiProperty()
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(1, 2000)
  content: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  postedBy: string;

  @ApiProperty({ enum: PosterType, default: PosterType.Owner })
  @IsEnum(PosterType)
  posterType: PosterType;

  @ApiProperty({ enum: PostType, required: true })
  @IsEnum(PostType)
  postType: PostType;
}

export class ChangePostStatusReqDto {
  @ApiProperty({ enum: PostStatus, required: true })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
