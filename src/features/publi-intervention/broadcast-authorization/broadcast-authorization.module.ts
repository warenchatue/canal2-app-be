import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BroadcastAuthorizationService } from './broadcast-authorization.service';
import { BroadcastAuthorizationController } from './broadcast-authorization.controller';
import {
  BroadcastAuthorization,
  BroadcastAuthorizationSchema,
} from './entities/broadcast-authorization.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BroadcastAuthorization.name,
        schema: BroadcastAuthorizationSchema,
      },
    ]),
  ],
  controllers: [BroadcastAuthorizationController],
  providers: [BroadcastAuthorizationService],
})
export class BroadcastAuthorizationModule {}
