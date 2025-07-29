import { AbstractRepo } from 'src/modules/database/abstract.repo';
import { Address } from '../schemas/address.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class AddressesRepo extends AbstractRepo<Address> {
  constructor(@InjectModel(Address.name) readonly model: Model<Address>) {
    super(model);
  }
}
