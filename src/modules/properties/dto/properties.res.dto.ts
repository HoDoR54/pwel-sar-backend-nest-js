import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PropertyType,
  PropertyStatus,
  PaymentType,
} from '../../database/enums';

export class AddressResponse {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({
    type: [Number],
    description: 'Coordinates as [longitude, latitude]',
  })
  coordinates: [number, number];

  @ApiProperty()
  fullAddress: string;

  @ApiPropertyOptional()
  floor?: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  township: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  stateOrRegion: string;

  @ApiProperty()
  postalCode: string;
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
}
