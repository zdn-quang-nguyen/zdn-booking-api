import { AutoMap } from '@automapper/classes';
import { IsString } from 'class-validator';
import { CreateSportFieldTypeDto } from './create-sport-field-type.dto';

export class ReadSportFieldTypeDto extends CreateSportFieldTypeDto {
  @AutoMap()
  @IsString()
  id: string;
}
