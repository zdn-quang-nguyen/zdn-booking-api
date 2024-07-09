import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { AccountType } from 'src/modules/account/entities/account.entity';
// import { ROLE } from 'src/constants/constants';
import { UserRole } from 'src/modules/user/entities/user.entity';

export class CreateAuthDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @Length(1, 52)
  name: string;
  @AutoMap()
  email: string;
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  phone: string;
  password: string;
  @AutoMap()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: AccountType;
}
