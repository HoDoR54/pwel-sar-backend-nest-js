import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DetailedPostResponse,
  PostStatusResponse,
  PropertyResponse,
  SimplePostResponse,
} from './dto/properties.res.dto';
import { PropertiesService } from './properties.service';
import {
  ChangePostStatusReqDto,
  CreatePostReqDto,
  CreatePropertyReqDto,
  GetAllPostsQueryReqDto,
  postSortingFields,
} from './dto/properties.req.dto';
import { PostStatus } from '../database/enums';
import { PaginatedReqDto, PaginatedResDto } from 'src/lib/dto/pagination.dto';
import {
  ApiPagination,
  Pagination,
} from 'src/lib/decorators/pagination.decorator';
import { SortingReqDto } from 'src/lib/dto/sorting.dto';
import { ApiSorting, Sorting } from 'src/lib/decorators/sorting.decorator';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly _propertiesService: PropertiesService) {}
  // TO-DO: Get all properties of one user
  // Get property details by id
  // Update a property
  // Soft-delete a property

  @Post()
  async createProperty(
    @Body() req: CreatePropertyReqDto,
  ): Promise<PropertyResponse> {
    return await this._propertiesService.createProperty(req);
  }

  @Post(':id/posts')
  async postPropertyAsAd(
    @Param('id') propertyId: string,
    @Body() req: CreatePostReqDto,
  ): Promise<DetailedPostResponse> {
    return await this._propertiesService.postPropertyAsAd(propertyId, req);
  }

  // archive, unarchive, delete, approve, reject
  @Patch('posts/:id/status')
  async changePostStatus(
    @Param('id') id: string,
    @Body() req: ChangePostStatusReqDto,
  ): Promise<PostStatusResponse> {
    return await this._propertiesService.changePostStatus(id, req);
  }

  @Get('posts/:id')
  async getPostById(@Param('id') id: string): Promise<DetailedPostResponse> {
    return await this._propertiesService.getPostById(id);
  }

  @Get('posts')
  @ApiPagination()
  @ApiSorting(postSortingFields.allowedFields)
  async getAllPostsWithFilter(
    @Query() filter: GetAllPostsQueryReqDto,
    @Pagination() pagination: PaginatedReqDto,
    @Sorting(postSortingFields) sorting: SortingReqDto,
  ): Promise<PaginatedResDto<SimplePostResponse>> {
    return await this._propertiesService.getAllPostsWithFilter(
      filter,
      pagination,
      sorting,
    );
  }
}
