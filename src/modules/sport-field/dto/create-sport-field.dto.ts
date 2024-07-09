import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { LocationEntity } from 'src/modules/location/entities/location.entity';
import { UploadImageDto } from 'src/common/dto/upload-image.dto';

export class CreateSportFieldDto {
  @AutoMap()
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsPositive()
  quantity: number;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phone: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @AutoMap()
  @ApiProperty()
  @IsPositive()
  price: number;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @MaxLength(65535)
  rule: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sportFieldTypeId: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  ownerId?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  createdBy?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  location?: Partial<LocationEntity>;

  @ApiProperty()
  @IsOptional()
  sportFieldImages: UploadImageDto[];
}
