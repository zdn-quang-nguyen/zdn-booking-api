import { CreateFieldDto } from './create-field.dto';
import { AutoMap } from '@automapper/classes';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFieldDto extends CreateFieldDto {
  @AutoMap()
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
