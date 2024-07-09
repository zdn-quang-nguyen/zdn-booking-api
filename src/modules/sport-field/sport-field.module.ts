import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SportFieldController } from './controllers/sport-field.controller';
import { SportFieldImageController } from './controllers/sport-field-image/sport-field-image.controller';
import { SportFieldTypeController } from './controllers/sport-field-type/sport-field-type.controller';

import { SportFieldService } from './services/sport-field.service';
import { SportFieldImageService } from './services/sport-field-image/sport-field-image.service';
import { SportFieldTypeService } from './services/sport-field-type/sport-field-type.service';

import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { SportFieldImageEntity } from './entities/sport-field-image.entity';
import { SportFieldTypeEntity } from './entities/sport-field-type.entity';

import { SportFieldProfile } from './profiles/sport-field.profile';
import { SportFieldTypeProfile } from './profiles/sport-field-type.profile';
import { SportFieldImageProfile } from './profiles/sport-field-image.profile';
import { LocationModule } from '../location/location.module';
import { FieldModule } from '../field/field.module';
import { SportFieldEventListeners } from './events/sport-field-event-listener.event';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SportFieldEntity,
      SportFieldTypeEntity,
      SportFieldImageEntity,
    ]),
    LocationModule,
    FieldModule,
  ],
  controllers: [
    SportFieldController,
    SportFieldImageController,
    SportFieldTypeController,
  ],
  providers: [
    SportFieldService,
    SportFieldImageService,
    SportFieldTypeService,
    SportFieldProfile,
    SportFieldTypeProfile,
    SportFieldImageProfile,
    SportFieldEventListeners,
  ],
  exports: [SportFieldImageService, SportFieldTypeService],
})
export class SportFieldModule {}
