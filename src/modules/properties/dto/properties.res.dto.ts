import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  PropertyStatus,
  PaymentType,
  PosterType,
  PostStatus,
  PostType,
} from '../../database/enums';

export class AddressResponse {
  @ApiProperty({ type: String }) id: string;

  @ApiProperty({
    type: [Number],
    description: 'Coordinates as [longitude, latitude]',
  })
  coordinates: [number, number];

  @ApiProperty() fullAddress: string;

  @ApiPropertyOptional() floor?: string;

  @ApiProperty() street: string;

  @ApiProperty() township: string;

  @ApiProperty() district: string;

  @ApiProperty() city: string;

  @ApiProperty() stateOrRegion: string;

  @ApiProperty() postalCode: string;

  @ApiPropertyOptional({ type: Date }) createdAt?: Date;

  @ApiPropertyOptional({ type: Date }) updatedAt?: Date;
}

export class PropertyResponse {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: [String] })
  imageUrls?: string[];

  @ApiProperty({ enum: PropertyType })
  type: PropertyType;

  @ApiProperty({ type: String })
  owner: string;

  @ApiProperty({ enum: PropertyStatus })
  status: PropertyStatus;

  @ApiPropertyOptional()
  areaInMeterSquared?: number;

  @ApiPropertyOptional()
  bedrooms?: number;

  @ApiPropertyOptional()
  bathrooms?: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: PaymentType })
  preferredPaymentType: PaymentType;

  @ApiProperty({ type: AddressResponse })
  address?: AddressResponse;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;
}

export class BasePostResponse {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() content: string;
  @ApiProperty({ enum: PosterType }) posterType: PosterType;
  @ApiProperty() postedBy: string;
  @ApiProperty({ enum: PostType }) postType: PostType;
  @ApiProperty({ enum: PostStatus }) status: PostStatus;
  @ApiPropertyOptional({ type: Date }) createdAt?: Date;
  @ApiPropertyOptional({ type: Date }) updatedAt?: Date;
}

export class SimplePostResponse extends BasePostResponse {}

export class DetailedPostResponse extends BasePostResponse {
  @ApiProperty({ type: PropertyResponse }) property: PropertyResponse;
}

export class PostStatusResponse {
  @ApiProperty({ type: String })
  postId: string;

  @ApiProperty({ enum: PostStatus, required: true })
  status: PostStatus;

  @ApiPropertyOptional({ type: String })
  rejectionReason?: string;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;
}
