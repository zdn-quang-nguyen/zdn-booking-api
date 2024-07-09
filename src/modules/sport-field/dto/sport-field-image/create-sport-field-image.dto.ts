import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';
import { UploadImageDto } from 'src/common/dto/upload-image.dto';

export class CreateSportFieldImageDto extends UploadImageDto {
  @AutoMap()
  @IsString()
  sportFieldId: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
