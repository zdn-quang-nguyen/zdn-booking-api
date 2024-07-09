import { AutoMap } from '@automapper/classes';
import { CreateSportFieldImageDto } from './create-sport-field-image.dto';
import { IsString } from 'class-validator';

export class ReadSportFieldImageDto extends CreateSportFieldImageDto {
  @AutoMap()
  @IsString()
  id: string;
}
