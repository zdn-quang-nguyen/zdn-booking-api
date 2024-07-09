import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @AutoMap()
  @IsOptional()
  id?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  sportFieldId?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  provinceId?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  districtId?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  wardId?: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  addressDetail: string;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  createdBy?: string;
}
