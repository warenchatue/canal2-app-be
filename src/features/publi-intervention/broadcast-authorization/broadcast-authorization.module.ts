import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Import EventEmitterModule
import { BroadcastAuthorizationService } from './broadcast-authorization.service';
import { BroadcastAuthorizationController } from './broadcast-authorization.controller';
import {
  BroadcastAuthorization,
  BroadcastAuthorizationSchema,
} from './entities/broadcast-authorization.entity';
import { PdfModule } from 'src/features/providers/pdf/pdf.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BroadcastAuthorization.name,
        schema: BroadcastAuthorizationSchema,
      },
    ]),
    EventEmitterModule.forRoot(), // Import and configure EventEmitterModule
    PdfModule,
  ],
  controllers: [BroadcastAuthorizationController],
  providers: [BroadcastAuthorizationService],
})
export class BroadcastAuthorizationModule {}
