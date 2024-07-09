import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FieldService } from 'src/modules/field/services/field.service';
import { SportFieldImageService } from '../services/sport-field-image/sport-field-image.service';
import { LocationService } from 'src/modules/location/location.service';
import {
  CreateFieldEvent,
  CreateLocationEvent,
  CreateSportFieldImageEvent,
  RemoveSportFieldImageEvent,
  UpdateLocationEvent,
} from './sport-field-events.event';

@Injectable()
export class SportFieldEventListeners {
  constructor(
    private readonly fieldService: FieldService,
    private readonly sportFieldImageService: SportFieldImageService,
    private readonly locationService: LocationService,
  ) {}

  @OnEvent('create.field')
  async handleCreateFieldEvent(event: CreateFieldEvent) {
    const field = await this.fieldService.createField({
      name: event.name,
      sportFieldId: event.sportFieldId,
      createdBy: event.createdBy,
    });
    if (!field) {
      throw new BadRequestException('field_not_created');
    }
  }

  @OnEvent('create.sportFieldImage')
  async handleCreateSportFieldImageEvent(event: CreateSportFieldImageEvent) {
    const image = await this.sportFieldImageService.createSportFieldImage({
      sportFieldId: event.sportFieldId,
      ...event.image,
      createdBy: event.createdBy,
    });
    if (!image) {
      throw new BadRequestException('sport_field_image_not_created');
    }
  }

  @OnEvent('create.location')
  async handleCreateLocationEvent(event: CreateLocationEvent) {
    const location = await this.locationService.create({
      sportFieldId: event.sportFieldId,
      ...event.locationObj,
      createdBy: event.createdBy,
    });
    if (!location) {
      throw new BadRequestException('location_not_created');
    }
  }

  @OnEvent('update.location')
  async handleUpdateLocationEvent(event: UpdateLocationEvent) {
    const updatedLocation = await this.locationService.update(
      event.locationId,
      event.locationObj,
    );
    if (!updatedLocation) {
      throw new BadRequestException('location_not_updated');
    }
  }

  @OnEvent('remove.sportFieldImage')
  async handleRemoveSportFieldImageEvent(event: RemoveSportFieldImageEvent) {
    const image = await this.sportFieldImageService.deleteSportFieldImage(
      event.imageId,
    );
    if (!image) {
      throw new BadRequestException('sport_field_image_not_deleted');
    }
  }
}
