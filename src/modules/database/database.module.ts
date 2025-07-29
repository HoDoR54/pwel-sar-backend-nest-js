import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../users/user.schema';
import {
  Property,
  PropertySchema,
} from '../properties/schemas/property.schema';
import { Address, AddressSchema } from '../properties/schemas/address.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Address.name, schema: AddressSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
