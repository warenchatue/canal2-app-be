import { Module } from '@nestjs/common';
import { AnnouncersService } from './announcers.service';
import { AnnouncersController } from './announcers.controller';
import { Announcer, AnnouncerSchema } from './entities/announcer.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncersHandler } from './announcers.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcer.name, schema: AnnouncerSchema },
    ]),
  ],
  controllers: [AnnouncersController],
  providers: [AnnouncersService, AnnouncersHandler],
  exports: [AnnouncersService],
})
export class AnnouncersModule {}
