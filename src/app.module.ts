import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { CONNECTION_TYPE, DB_CERT, DB_HOST } from './common/vars';
import { AuthModule } from './features/auth/auth.module';
import { CountriesModule } from './features/countries/countries.module';
import { HoursModule } from './features/hours/hours.module';
import { RolesModule } from './features/roles/roles.module';
import { UsersModule } from './features/users/users.module';
import { AnnouncersModule } from './features/announcers/announcers.module';
import { PackagesModule } from './features/orders/orders.module';
import { SpotsModule } from './features/products/products.module';
import { PlanningsModule } from './features/plannings/plannings.module';

const features = [
  AuthModule,
  UsersModule,
  RolesModule,
  CountriesModule,
  HoursModule,
  AnnouncersModule,
  PackagesModule,
  SpotsModule,
  PlanningsModule,
];

const DbOpts: MongooseModuleOptions = {
  ssl: true,
  sslValidate: true,
  sslCert: DB_CERT,
  sslKey: DB_CERT,
  authMechanism: 'MONGODB-X509',
};

@Module({
  imports: [
    CacheModule.register(),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      DB_HOST as string,
      CONNECTION_TYPE === 'cert' ? DbOpts : {},
    ),
    ...features,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
