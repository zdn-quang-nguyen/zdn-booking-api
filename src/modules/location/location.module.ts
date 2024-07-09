import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceEntity } from './entities/province.entity';
import { DistrictEntity } from './entities/district.entity';
import { WardEntity } from './entities/ward.entity';
import { LocationEntity } from './entities/location.entity';
import { LocationProfile } from './location.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocationEntity,
      ProvinceEntity,
      DistrictEntity,
      WardEntity,
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationProfile],
  exports: [LocationService],
})
export class LocationModule {}
