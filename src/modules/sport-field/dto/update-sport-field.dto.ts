import { IsOptional } from 'class-validator';
import { CreateSportFieldDto } from './create-sport-field.dto';

export class UpdateSportFieldDto extends CreateSportFieldDto {
  @IsOptional()
  removeImageIds?: string[];
}
