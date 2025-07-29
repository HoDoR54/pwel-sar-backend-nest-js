import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PropertiesRepo } from './repos/properties.repo';
import { PropertiesMapper } from './mappers';
import { AddressesRepo } from './repos/addresses.repo';

@Module({
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    PropertiesRepo,
    PropertiesMapper,
    AddressesRepo,
  ],
})
export class PropertiesModule {}
