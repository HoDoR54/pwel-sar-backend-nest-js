import { Injectable } from '@nestjs/common';
import {
  CreatePostReqDto,
  CreatePropertyReqDto,
} from './dto/properties.req.dto';
import { PostResponse, PropertyResponse } from './dto/properties.res.dto';
import { PropertiesRepo } from './repos/properties.repo';
import { AddressesRepo } from './repos/addresses.repo';
import { Types } from 'mongoose';
import { Mapper } from '../../lib/helpers/mappers';
import { PostsRepo } from './repos/posts.repo';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly _addressRepo: AddressesRepo,
    private readonly _propertiesRepo: PropertiesRepo,
    private readonly _postsRepo: PostsRepo,
    private readonly _mapper: Mapper,
  ) {}

  async createProperty(req: CreatePropertyReqDto): Promise<PropertyResponse> {
    const { address, ...propData } = req;

    // TO-DO: get owner from token
    const ownerId = new Types.ObjectId();

    const createdProp = await this._propertiesRepo.createOne({
      ...propData,
      owner: ownerId,
    });

    const createdAddress = await this._addressRepo.createOne({
      ...address,
      property: createdProp._id,
      location: {
        type: 'Point',
        coordinates: address.coordinates,
      },
    });

    const updatedProp = await this._propertiesRepo.updateOne(
      { _id: createdProp._id },
      { address: createdAddress._id },
    );

    return this._mapper.propDocumentToResponse(updatedProp!, createdAddress);
  }

  async postAnAdvertisement(req: CreatePostReqDto): Promise<PostResponse> {
    const createdPost = await this._postsRepo.createOne({
      ...req,
      postedBy: new Types.ObjectId(req.postedBy),
      property: new Types.ObjectId(req.property),
    });
    return this._mapper.postDocumentToResponse(createdPost);
  }
}
