import { Types } from 'mongoose';
import {
  AddressResponse,
  DetailedPostResponse,
  PostStatusResponse,
  PropertyResponse,
  SimplePostResponse,
} from '../../modules/properties/dto/properties.res.dto';
import { Address } from '../../modules/properties/schemas/address.schema';
import { Property } from '../../modules/properties/schemas/property.schema';
import { UserResponse } from 'src/modules/users/dto/users.res.dto';
import { User } from 'src/modules/users/user.schema';
import { Post } from 'src/modules/properties/schemas/posts.schema';

export class Mapper {
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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return res;
  }

  postDocumentToDetailedResponse(
    doc: Post,
    propertyDoc: Property,
    addressDoc: Address,
  ): DetailedPostResponse {
    const res: DetailedPostResponse = {
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      property: this.propDocumentToResponse(propertyDoc, addressDoc),
      posterType: doc.posterType,
      status: doc.status,
      postedBy: doc.postedBy.toString(),
      postType: doc.postType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return res;
  }

  postDocumentToSimpleResponse(doc: Post): SimplePostResponse {
    return {
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      posterType: doc.posterType,
      postedBy: doc.postedBy.toString(),
      postType: doc.postType,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  postDocumentToStatusResponse(doc: Post): PostStatusResponse {
    return {
      status: doc.status,
      postId: doc._id.toString(),
      updatedAt: doc.updatedAt,
      rejectionReason: doc.rejectionReason,
    };
  }

  userDocumentToResponse = (model: User): UserResponse => {
    const mapped: UserResponse = {
      _id: model._id.toString(),
      name: model.name,
      email: model.email,
      profileUrl: model.profileUrl,
      bio: model.bio,
    };

    return mapped;
  };
}
