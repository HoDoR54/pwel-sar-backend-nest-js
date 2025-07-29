import { Types } from 'mongoose';
import { AddressResponse, PropertyResponse } from './dto/properties.res.dto';
import { Address } from './schemas/address.schema';
import { Property } from './schemas/property.schema';

export class PropertiesMapper {
  propDocumentToResponse(doc: Property, addressDoc: Address): PropertyResponse {
    const res: PropertyResponse = {
      id: doc._id.toString(),
      imageUrls: doc.imageUrls,
      type: doc.type,
      owner: doc.owner.toString(),
      status: doc.status,
      areaInMeterSquared: doc.areaInMeterSquared,
      bedrooms: doc.bedrooms,
      bathrooms: doc.bathrooms,
      price: doc.price,
      preferredPaymentType: doc.preferredPaymentType,
      address: this.addressDocumentToResponse(addressDoc),
    };
    return res;
  }

  addressDocumentToResponse(doc: Address): AddressResponse {
    const res: AddressResponse = {
      id: doc._id.toString(),
      coordinates: doc.location.coordinates,
      fullAddress: doc.fullAddress,
      floor: doc.floor,
      street: doc.street,
      township: doc.township,
      district: doc.district,
      city: doc.city,
      stateOrRegion: doc.stateOrRegion,
      postalCode: doc.postalCode,
    };
    return res;
  }
}
