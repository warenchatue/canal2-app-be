import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { Journal, JournalSchema } from './entities/journal.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalsHandler } from './journals.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
  ],
  controllers: [JournalsController],
  providers: [JournalsService, JournalsHandler],
  exports: [JournalsService],
})
export class JournalsModule {}
