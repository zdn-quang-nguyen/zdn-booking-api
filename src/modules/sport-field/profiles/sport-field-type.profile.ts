import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap } from '@automapper/core';

import { SportFieldTypeEntity } from '../entities/sport-field-type.entity';
import { CreateSportFieldTypeDto } from '../dto/sport-field-type/create-sport-field-type.dto';
import { ReadSportFieldTypeDto } from '../dto/sport-field-type/read-sport-field-type.dto';
import { UpdateSportFieldTypeDto } from '../dto/sport-field-type/update-sport-field-type.dto';

@Injectable()
export class SportFieldTypeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, SportFieldTypeEntity, ReadSportFieldTypeDto);
      createMap(mapper, CreateSportFieldTypeDto, SportFieldTypeEntity);
      createMap(mapper, UpdateSportFieldTypeDto, SportFieldTypeEntity);
    };
  }
}
