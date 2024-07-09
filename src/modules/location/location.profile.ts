import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { LocationEntity } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    {
      return (mapper: Mapper) => {
        // createMap(mapper, Location, CreateLocationDto);
        createMap(mapper, CreateLocationDto, LocationEntity);
      };
    }
  }
}
