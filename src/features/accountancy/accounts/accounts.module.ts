import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account, AccountSchema } from './entities/account.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsHandler } from './accounts.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsHandler],
  exports: [AccountsService],
})
export class AccountsModule {}
