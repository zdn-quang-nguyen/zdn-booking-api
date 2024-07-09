import { AutoMap } from '@automapper/classes';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  role: UserRole;

  @AutoMap()
  imageUrl?: string;
}
