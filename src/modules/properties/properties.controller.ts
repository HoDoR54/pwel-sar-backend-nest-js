import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostResponse, PropertyResponse } from './dto/properties.res.dto';
import { PropertiesService } from './properties.service';
import {
  CreatePostReqDto,
  CreatePropertyReqDto,
} from './dto/properties.req.dto';

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

  @Post('create-post')
  async postAnAdvertisement(
    @Body() req: CreatePostReqDto,
  ): Promise<PostResponse> {
    return await this._propertiesService.postAnAdvertisement(req);
  }
}
