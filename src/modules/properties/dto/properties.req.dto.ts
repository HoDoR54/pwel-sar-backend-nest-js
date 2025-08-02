import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  AvailabilityStatus,
  PaymentType,
  PosterType,
  PostType,
  ApprovalStatus,
} from '../../database/enums';
import { PaginatedReqDto } from 'src/lib/dto/pagination.dto';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
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
    enum: AvailabilityStatus,
    default: AvailabilityStatus.Available,
  })
  @IsEnum(AvailabilityStatus)
  status: AvailabilityStatus;

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

export class GetAllPropertiesQueryReqDto extends PaginatedReqDto {
  @ApiPropertyOptional({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @ApiPropertyOptional({ enum: AvailabilityStatus })
  @IsEnum(AvailabilityStatus)
  @IsOptional()
  status?: AvailabilityStatus;

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
  @ApiProperty({ enum: ApprovalStatus, required: true })
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class GetAllPostsQueryReqDto {
  @ApiPropertyOptional({ enum: PostType })
  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  township?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stateOrRegion?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  posterId?: string;
}

export const postSortingFields = {
  allowedFields: ['createdAt', 'updatedAt', 'price'],
  fieldMap: { price: 'property.price' },
};
