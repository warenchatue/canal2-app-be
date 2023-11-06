import { Module } from '@nestjs/common';
import { Role, RoleSchema } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesHandler } from './roles.handler';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesHandler],
  exports: [RolesService],
})
export class RolesModule {}
