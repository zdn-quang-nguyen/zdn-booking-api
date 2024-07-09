import { Module } from '@nestjs/common';
import { FieldService } from './services/field.service';
import { FieldController } from './controllers/field.controller';
import { FieldProfile } from './profile/field.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldEntity } from './entities/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldEntity])],
  controllers: [FieldController],
  providers: [FieldService, FieldProfile],
  exports: [FieldService],
})
export class FieldModule {}
