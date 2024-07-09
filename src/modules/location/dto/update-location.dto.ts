// import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';
import { AutoMap } from '@automapper/classes';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto extends CreateLocationDto {
  @AutoMap()
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  deletedBy?: string;
}
