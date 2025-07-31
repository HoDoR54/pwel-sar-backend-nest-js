import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PropertiesRepo } from './repos/properties.repo';
import { AddressesRepo } from './repos/addresses.repo';
import { PostsRepo } from './repos/posts.repo';
import { Mapper } from 'src/lib/helpers/mappers';

@Module({
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    PropertiesRepo,
    AddressesRepo,
    PostsRepo,
    Mapper,
  ],
})
export class PropertiesModule {}
