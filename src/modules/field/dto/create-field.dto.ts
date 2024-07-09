import { AutoMap } from '@automapper/classes';
import {
  // IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CreateFieldDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  sportFieldId: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  createdBy?: string;
}
