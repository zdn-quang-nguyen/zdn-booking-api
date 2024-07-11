import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  controllers: [NotificationController],
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
