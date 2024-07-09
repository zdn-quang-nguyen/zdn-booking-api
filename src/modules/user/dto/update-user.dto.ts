import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @AutoMap()
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('VN')
  @IsNotEmpty()
  @AutoMap()
  phone: string;
}
