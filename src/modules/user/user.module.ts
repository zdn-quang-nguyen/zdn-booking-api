import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { UserEntity } from './entities/user.entity';
import { UserProfile } from './profile/user.profile';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { KeycloakService } from '../auth/api/auth';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AccountModule],
  controllers: [UserController],
  providers: [UserService, UserProfile, KeycloakService],
  exports: [UserService],
})
export class UserModule {}
