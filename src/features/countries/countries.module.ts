import { Module } from '@nestjs/common';
import { Country, CountrySchema } from './entities/country.entity';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { CountriesHandler } from './countries.handler';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, CountriesHandler],
  exports: [CountriesService],
})
export class CountriesModule {}
