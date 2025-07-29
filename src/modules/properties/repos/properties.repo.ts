import { AbstractRepo } from 'src/modules/database/abstract.repo';
import { Property } from '../schemas/property.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class PropertiesRepo extends AbstractRepo<Property> {
  constructor(@InjectModel(Property.name) readonly model: Model<Property>) {
    super(model);
  }
}
