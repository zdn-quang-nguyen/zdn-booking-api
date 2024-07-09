import { PartialType } from '@nestjs/mapped-types';
import { CreateSportFieldImageDto } from './create-sport-field-image.dto';

export class UpdateSportFieldImageDto extends PartialType(
  CreateSportFieldImageDto,
) {}
