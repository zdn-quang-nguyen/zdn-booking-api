import { LocationEntity } from 'src/modules/location/entities/location.entity';
import { SportFieldImageEntity } from '../entities/sport-field-image.entity';
import { SportFieldTypeEntity } from '../entities/sport-field-type.entity';
import { AutoMap } from '@automapper/classes';

export class GetSportFieldDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  quantity: number;

  @AutoMap()
  phone: string;

  @AutoMap()
  startTime: string;

  @AutoMap()
  endTime: string;

  @AutoMap()
  price: number;

  @AutoMap()
  rule: string;

  @AutoMap()
  ownerId?: string;

  @AutoMap()
  location: LocationEntity;

  @AutoMap()
  sportFieldImages: SportFieldImageEntity[];

  @AutoMap()
  sportFieldType: SportFieldTypeEntity;
}
