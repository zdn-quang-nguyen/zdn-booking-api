import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateSocialUserDto {
  @AutoMap()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
