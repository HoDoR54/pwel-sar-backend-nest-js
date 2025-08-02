import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { PaginatedReqDto, PaginatedResDto } from 'src/lib/dto/pagination.dto';
import {
  ApiPagination,
  Pagination,
} from 'src/lib/decorators/pagination.decorator';
import {
  ApiSorting,
  Sorting,
  SortParams,
} from 'src/lib/decorators/sorting.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly _propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  async createProperty(
    @Body() req: CreatePropertyReqDto,
    @Request() reqObj: any,
  ): Promise<PropertyResponse> {
    const ownerId = reqObj.user.userId;
    return await this._propertiesService.createProperty(req, ownerId);
  }

  @Post(':id/posts')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Post a property as an ad' })
  async postPropertyAsAd(
    @Param('id') propertyId: string,
    @Body() req: CreatePostReqDto,
    @Request() reqObj: any,
  ): Promise<DetailedPostResponse> {
    const postedBy = reqObj.user.userId;
    return await this._propertiesService.postPropertyAsAd(
      propertyId,
      req,
      postedBy,
    );
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
    @Sorting(postSortingFields) sorting: SortParams,
  ): Promise<PaginatedResDto<SimplePostResponse>> {
    return await this._propertiesService.getAllPostsWithFilter(
      filter,
      pagination,
      sorting,
    );
  }
}
