import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { AccountModule } from '../account/account.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { KeycloakService } from './api/auth';

@Module({
  controllers: [AuthController],
  providers: [AuthService, KeycloakService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([AccountEntity, UserEntity]),
    AccountModule,
    UserModule,
  ],
})
export class AuthModule {}
