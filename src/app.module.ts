import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { CONNECTION_TYPE, DB_CERT, DB_HOST } from './common/vars';
import { AccountsModule } from './features/accountancy/accounts/accounts.module';
import { TaxesModule } from './features/accountancy/taxes/taxes.module';
import { AnnouncersModule } from './features/announcers/announcers.module';
import { ArticlesModule } from './features/articles/articles.module';
import { AuthModule } from './features/auth/auth.module';
import { CountriesModule } from './features/countries/countries.module';
import { HoursModule } from './features/pub/hours/hours.module';
import { PackagesModule } from './features/orders/orders.module';
import { OrgsModule } from './features/orgs/orgs.module';
import { PlanningsModule } from './features/plannings/plannings.module';
import { SpotsModule } from './features/products/products.module';
import { RolesModule } from './features/roles/roles.module';
import { UsersModule } from './features/users/users.module';

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
  ArticlesModule,
  OrgsModule,
  AccountsModule,
  TaxesModule,
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
