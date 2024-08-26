import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../../notifications/notifications.module';
import { UsersModule } from '../../users/users.module';
import { TvProgram, TvProgramSchema } from './entities/program.entity';
import { TvProgramController } from './programs.controller';
import { TvProgramHandler } from './programs.handler';
import { TvProgramsService } from './programs.service';
import { PlanningsModule } from '../../pub/plannings/plannings.module';
import { SpotsModule } from '../../products/products.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TvProgram.name, schema: TvProgramSchema },
    ]),
    forwardRef(() => PlanningsModule),
    forwardRef(() => SpotsModule),
    NotificationsModule,
    UsersModule,
  ],
  controllers: [TvProgramController],
  providers: [TvProgramsService, TvProgramHandler],
  exports: [TvProgramsService],
})
export class TvProgramsModule {}
