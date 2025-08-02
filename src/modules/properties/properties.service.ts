import { Injectable } from '@nestjs/common';
import {
  ChangePostStatusReqDto,
  CreatePostReqDto,
  CreatePropertyReqDto,
  GetAllPostsQueryReqDto,
} from './dto/properties.req.dto';
import {
  DetailedPostResponse,
  PostStatusResponse,
  PropertyResponse,
  SimplePostResponse,
} from './dto/properties.res.dto';
import { PropertiesRepo } from './repos/properties.repo';
import { AddressesRepo } from './repos/addresses.repo';
import { Types } from 'mongoose';
import { Mapper } from '../../lib/helpers/mappers';
import { PostsRepo } from './repos/posts.repo';
import { PaginatedReqDto, PaginatedResDto } from 'src/lib/dto/pagination.dto';
import { ApprovalStatus } from '../database/enums';
import { SortParams } from 'src/lib/decorators/sorting.decorator';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly _addressRepo: AddressesRepo,
    private readonly _propertiesRepo: PropertiesRepo,
    private readonly _postsRepo: PostsRepo,
    private readonly _mapper: Mapper,
  ) {}

  async createProperty(
    req: CreatePropertyReqDto,
    ownerId: string,
  ): Promise<PropertyResponse> {
    const { address, ...propData } = req;

    const createdProp = await this._propertiesRepo.createOne({
      ...propData,
      owner: new Types.ObjectId(ownerId),
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
    postedBy: string,
  ): Promise<DetailedPostResponse> {
    const createdPost = await this._postsRepo.createOne({
      ...req,
      postedBy: new Types.ObjectId(postedBy),
      property: new Types.ObjectId(propertyId),
      status: ApprovalStatus.Pending,
    });
    const matchedProp = await this._propertiesRepo.getOneOrThrow({
      _id: createdPost.property,
    });
    const matchedAddress = await this._addressRepo.getOneOrThrow({
      _id: matchedProp.address,
    });
    return this._mapper.postDocumentToDetailedResponse(
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
      req.status.toLowerCase() === ApprovalStatus.Rejected.toLowerCase() &&
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

  async getPostById(id: string): Promise<DetailedPostResponse> {
    const post = await this._postsRepo.getOneOrThrow({ _id: id });
    const property = await this._propertiesRepo.getOneOrThrow({
      _id: post.property,
    });
    const address = await this._addressRepo.getOneOrThrow({
      _id: property.address,
    });

    return this._mapper.postDocumentToDetailedResponse(post, property, address);
  }

  async getAllPostsWithFilter(
    filter: GetAllPostsQueryReqDto,
    pagination: PaginatedReqDto,
    sorting: SortParams,
  ): Promise<PaginatedResDto<SimplePostResponse>> {
    const { page, size } = pagination;
    const { sortField, sortDirection } = sorting;
    const query: any = {};

    if (filter.propertyType || filter.minPrice || filter.maxPrice) {
      query['property.propertyType'] = {
        $eq: query.propertyType,
      };
      if (filter.minPrice || filter.maxPrice) {
        query['property.price'] = {};
        if (filter.minPrice) query['property.price'].$gte = filter.minPrice;
        if (filter.maxPrice) query['property.price'].$lte = filter.maxPrice;
      }
    }

    if (
      filter.city ||
      filter.township ||
      filter.street ||
      filter.stateOrRegion
    ) {
      query['property.address.city'] = filter.city;
      query['property.address.township'] = filter.township;
      query['property.address.street'] = filter.street;
      query['property.address.stateOrRegion'] = filter.stateOrRegion;
    }

    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { content: { $regex: filter.search, $options: 'i' } },
        {
          'property.address.fullAddress': {
            $regex: filter.search,
            $options: 'i',
          },
        },
        { 'property.address.street': { $regex: filter.search, $options: 'i' } },
        {
          'property.address.township': { $regex: filter.search, $options: 'i' },
        },
        { 'property.address.city': { $regex: filter.search, $options: 'i' } },
        {
          'property.address.stateOrRegion': {
            $regex: filter.search,
            $options: 'i',
          },
        },
      ];
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortField) {
      sort[sortField] = sortDirection;
    }

    const currentPage = page || 1;
    const pageSize = size || 10;
    const skip = (currentPage - 1) * pageSize;

    const [totalItems, posts] = await Promise.all([
      this._postsRepo.count(query),
      this._postsRepo.getMany(query, { skip, limit: pageSize }),
    ]);

    return {
      items: posts.map((post) =>
        this._mapper.postDocumentToSimpleResponse(post),
      ),
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage,
      pageSize,
    };
  }
}
