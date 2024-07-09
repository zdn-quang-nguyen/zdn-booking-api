import { CreateFieldDto } from './create-field.dto';
import { IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';

export class ReadFieldDto extends CreateFieldDto {
  @AutoMap()
  @IsString()
  id: string;

  @AutoMap()
  sportField: SportFieldEntity;
}
