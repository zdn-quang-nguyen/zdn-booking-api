import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateSportFieldDto } from '../dto/create-sport-field.dto';
import { ReadSportFieldDto } from '../dto/read-sport-field.dto';
import { UpdateSportFieldDto } from '../dto/update-sport-field.dto';
import { SportFieldEntity } from '../entities/sport-field.entity';
import { GetSportFieldDto } from '../dto/get-sport-field.dto';

@Injectable()
export class SportFieldProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SportFieldEntity,
        ReadSportFieldDto,
        forMember(
          (destination) => destination.fieldIds,
          mapFrom((source) =>
            source.fields?.map((field) => {
              if (field instanceof Object) {
                return field.id;
              }
              return field;
            }),
          ),
        ),
        forMember(
          (destination) => destination.sportFieldImages,
          mapFrom((source) => source.sportFieldImages),
        ),
        forMember(
          (destination) => destination.location,
          mapFrom((source) => source.location),
        ),
        forMember(
          (destination) => destination.fields,
          mapFrom((source) => source.fields),
        ),
      );
      createMap(mapper, CreateSportFieldDto, SportFieldEntity);
      createMap(mapper, UpdateSportFieldDto, SportFieldEntity);
      createMap(
        mapper,
        SportFieldEntity,
        GetSportFieldDto,
        forMember(
          (destination) => destination.sportFieldType,
          mapFrom((source) => source.sportFieldType),
        ),
        forMember(
          (destination) => destination.sportFieldImages,
          mapFrom((source) => source.sportFieldImages),
        ),
        forMember(
          (destination) => destination.location,
          mapFrom((source) => source.location),
        ),
      );
    };
  }
}
