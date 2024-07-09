import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';

import { SportFieldImageEntity } from '../entities/sport-field-image.entity';
import { ReadSportFieldImageDto } from '../dto/sport-field-image/read-sport-field-image.dto';
import { UpdateSportFieldImageDto } from '../dto/sport-field-image/update-sport-field-image.dto';
import { CreateSportFieldImageDto } from '../dto/sport-field-image/create-sport-field-image.dto';

@Injectable()
export class SportFieldImageProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SportFieldImageEntity,
        ReadSportFieldImageDto,
        forMember(
          (destination) => destination.sportFieldId,
          mapFrom((source) => {
            if (source.sportField) {
              return source.sportField.id;
            }
            return '';
          }),
        ),
      );
      createMap(
        mapper,
        CreateSportFieldImageDto,
        SportFieldImageEntity,
        forMember(
          (destination) => destination.sportField.id,
          mapFrom((source) => {
            if (source.sportFieldId) {
              return source.sportFieldId;
            }
            return undefined;
          }),
        ),
      );
      createMap(mapper, UpdateSportFieldImageDto, SportFieldImageEntity);
    };
  }
}
