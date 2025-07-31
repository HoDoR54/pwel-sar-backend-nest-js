import { Injectable } from '@nestjs/common';
import {
  ChangePostStatusReqDto,
  CreatePostReqDto,
  CreatePropertyReqDto,
} from './dto/properties.req.dto';
import {
  PostResponse,
  PostStatusResponse,
  PropertyResponse,
} from './dto/properties.res.dto';
import { PropertiesRepo } from './repos/properties.repo';
import { AddressesRepo } from './repos/addresses.repo';
import { Types } from 'mongoose';
import { Mapper } from '../../lib/helpers/mappers';
import { PostsRepo } from './repos/posts.repo';
import { PostStatus, PostType } from '../database/enums';

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

  async postPropertyAsAd(
    propertyId: string,
    req: CreatePostReqDto,
  ): Promise<PostResponse> {
    const createdPost = await this._postsRepo.createOne({
      ...req,
      postedBy: new Types.ObjectId(req.postedBy),
      property: new Types.ObjectId(propertyId),
      status: PostStatus.Pending,
      rejectionReason: undefined,
    });
    const matchedProp = await this._propertiesRepo.getOneOrThrow({
      _id: createdPost.property,
    });
    const matchedAddress = await this._addressRepo.getOneOrThrow({
      _id: matchedProp.address,
    });
    return this._mapper.postDocumentToResponse(
      createdPost,
      matchedProp,
      matchedAddress,
    );
  }

  async changePostStatus(
    id: string,
    req: ChangePostStatusReqDto,
  ): Promise<PostStatusResponse> {
    const post = await this._postsRepo.getOneOrThrow({ _id: id });

    if (post.status === req.status) {
      return this._mapper.postDocumentToStatusResponse(post);
    }

    if (
      req.status.toLowerCase() === PostStatus.Rejected.toLowerCase() &&
      (!req.rejectionReason || req.rejectionReason.trim() === '')
    ) {
      throw new Error('Rejection reason is required for rejected posts');
    }

    const updatedPost = await this._postsRepo.updateOne(
      { _id: id },
      { status: req.status, rejectionReason: req.rejectionReason },
    );

    if (!updatedPost) {
      throw new Error('Post not found or update failed');
    }

    return this._mapper.postDocumentToStatusResponse(updatedPost);
  }
}
