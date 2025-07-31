import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PostResponse,
  PostStatusResponse,
  PropertyResponse,
} from './dto/properties.res.dto';
import { PropertiesService } from './properties.service';
import {
  ChangePostStatusReqDto,
  CreatePostReqDto,
  CreatePropertyReqDto,
} from './dto/properties.req.dto';
import { PostStatus } from '../database/enums';

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
  ): Promise<PostResponse> {
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
}
