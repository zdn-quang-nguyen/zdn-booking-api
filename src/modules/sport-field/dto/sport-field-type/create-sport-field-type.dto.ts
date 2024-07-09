import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSportFieldTypeDto {
  @AutoMap()
  @IsString()
  @MaxLength(255)
  name: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
