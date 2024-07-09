import { PartialType } from '@nestjs/mapped-types';
import { CreateSportFieldTypeDto } from './create-sport-field-type.dto';
export class UpdateSportFieldTypeDto extends PartialType(
  CreateSportFieldTypeDto,
) {}
