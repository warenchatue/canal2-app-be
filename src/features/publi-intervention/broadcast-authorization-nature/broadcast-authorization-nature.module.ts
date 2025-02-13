import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Import EventEmitterModule
import { BroadcastAuthorizationNatureService } from './broadcast-authorization-nature.service';
import { BroadcastAuthorizationNatureController } from './broadcast-authorization-nature.controller';
import {
  BroadcastAuthorizationNature,
  BroadcastAuthorizationNatureSchema,
} from './entities/broadcast-authorization-nature.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BroadcastAuthorizationNature.name,
        schema: BroadcastAuthorizationNatureSchema,
      },
    ]),
    EventEmitterModule.forRoot(), // Import and configure EventEmitterModule
  ],
  controllers: [BroadcastAuthorizationNatureController],
  providers: [BroadcastAuthorizationNatureService],
})
export class BroadcastAuthorizationNatureModule {}
