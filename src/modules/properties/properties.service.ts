import { Injectable } from '@nestjs/common';
import { CreatePropertyReqDto } from './dto/properties.req.dto';
import { PropertyResponse } from './dto/properties.res.dto';
import { PropertiesRepo } from './repos/properties.repo';
import { AddressesRepo } from './repos/addresses.repo';
import { Types } from 'mongoose';
import { PropertiesMapper } from './mappers';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly _addressRepo: AddressesRepo,
    private readonly _propertiesRepo: PropertiesRepo,
    private readonly _propertiesMapper: PropertiesMapper,
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

    return this._propertiesMapper.propDocumentToResponse(
      updatedProp!,
      createdAddress,
    );
  }
}
