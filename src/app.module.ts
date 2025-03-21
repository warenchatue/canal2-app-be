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
import { OrdersModule } from './features/orders/orders.module';
import { OrgsModule } from './features/orgs/orgs.module';
import { PlanningsModule } from './features/pub/plannings/plannings.module';
import { SpotsModule } from './features/products/products.module';
import { RolesModule } from './features/roles/roles.module';
import { UsersModule } from './features/users/users.module';
import { PackagesModule } from './features/pub/packages/packages.module';
import { InvoicesModule } from './features/accountancy/invoices/invoices.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { PaymentMethodsModule } from './features/accountancy/payment-methods/payment-methods.module';
import { PaymentConditionsModule } from './features/accountancy/payment-conditions/payment-conditions.module';
import { ArticleCategoriesModule } from './features/article-categories/article-categories.module';
import { AccountingDocsModule } from './features/accountancy/accounting-docs/accounting-docs.module';
import { RecoveryProceduresModule } from './features/recovery/recovery-procedures/recovery-procedures.module';
import { JournalsModule } from './features/accountancy/journals/journals.module';
import { DocTypesModule } from './features/accountancy/doc-types/doc-types.module';
import { SuppliersModule } from './features/suppliers/suppliers.module';
import { PurchaseOrdersModule } from './features/purchase-orders/purchase-orders.module';
import { PurchaseInvoicesModule } from './features/accountancy/purchase-invoices/purchase-invoices.module';
import { ProgramCategoriesModule } from './features/tv-programs/programs-categories/program-categories.module';
import { TvProgramsModule } from './features/tv-programs/programs/programs.module';
import { DatabaseModule } from './features/database/database.module';
import { AssetModule } from './features/assets/asset/asset.module';
import { AssetBrandModule } from './features/assets/asset-brand/asset-brand.module';
import { AssetModelModule } from './features/assets/asset-model/asset-model.module';
import { AssetCategoryModule } from './features/assets/asset-category/asset-category.module';
import { AssetFloorModule } from './features/assets/asset-floor/asset-floor.module';
import { AssetRoomModule } from './features/assets/asset-room/asset-room.module';
import { HrDepartmentModule } from './features/hr/hr-department/hr-department.module';
import { HrServiceModule } from './features/hr/hr-service/hr-services.module';
import { HrPositionModule } from './features/hr/hr-position/hr-position.module';
import { HrAddressModule } from './features/hr/hr-address/hr-address.module';
import { HrPersonnelModule } from './features/hr/hr-personnel/hr-personnel.module';
import { HrJobModule } from './features/hr/hr-job/hr-job.module';
import { ProgramPlanningsModule } from './features/tv-programs/programs-planning/programs-plannings.module';
import { BroadcastAuthorizationModule } from './features/publi-intervention/broadcast-authorization/broadcast-authorization.module';
import { BroadcastAuthorizationNatureModule } from './features/publi-intervention/broadcast-authorization-nature/broadcast-authorization-nature.module';
import { ExpenseCategoryModule } from './features/accountancy/expenses-category/expenses-category.module';

const features = [
  AuthModule,
  UsersModule,
  RolesModule,
  CountriesModule,
  HoursModule,
  AnnouncersModule,
  OrdersModule,
  SpotsModule,
  PlanningsModule,
  ArticlesModule,
  OrgsModule,
  AccountsModule,
  TaxesModule,
  PackagesModule,
  InvoicesModule,
  TransactionsModule,
  PaymentMethodsModule,
  PaymentConditionsModule,
  ArticleCategoriesModule,
  AccountingDocsModule,
  RecoveryProceduresModule,
  JournalsModule,
  DocTypesModule,
  SuppliersModule,
  PurchaseOrdersModule,
  PurchaseInvoicesModule,
  ProgramCategoriesModule,
  TvProgramsModule,
  DatabaseModule,
  AssetCategoryModule,
  AssetModelModule,
  AssetBrandModule,
  AssetFloorModule,
  AssetRoomModule,
  AssetModule,
  HrDepartmentModule,
  HrServiceModule,
  HrPositionModule,
  HrAddressModule,
  HrPersonnelModule,
  HrJobModule,
  ProgramPlanningsModule,
  BroadcastAuthorizationModule,
  BroadcastAuthorizationNatureModule,
  ExpenseCategoryModule,
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
