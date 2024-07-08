/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SportFieldService } from '../services/sport-field.service';

import { CreateSportFieldDto } from '../dto/create-sport-field.dto';
import { UpdateSportFieldDto } from '../dto/update-sport-field.dto';
import { BaseResponse } from 'src/common/response/base.response';
import { Public } from 'nest-keycloak-connect';
import { FieldService } from 'src/modules/field/services/field.service';
import { SportFieldImageService } from '../services/sport-field-image/sport-field-image.service';
import { LocationService } from 'src/modules/location/location.service';
import { CreateFieldDto } from 'src/modules/field/dto/create-field.dto';
import { UploadImageDto } from 'src/common/dto/upload-image.dto';
import { CreateSportFieldImageDto } from '../dto/sport-field-image/create-sport-field-image.dto';
import { CreateLocationDto } from 'src/modules/location/dto/create-location.dto';
import {
  CreateFieldEvent,
  CreateLocationEvent,
  CreateSportFieldImageEvent,
  RemoveSportFieldImageEvent,
  UpdateLocationEvent,
} from '../events/sport-field-events.event';
import {
  Pagination,
  PaginationParams,
} from 'src/decorators/pagination.decorator';
import { Filtering, FilteringParams } from 'src/decorators/filter.decorator';
import { User } from 'src/decorators/user.decorator';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import { create } from 'domain';
import { ReadSportFieldDto } from '../dto/read-sport-field.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@ApiTags('sport-field')
@Controller('sport-field')
@ApiBearerAuth(API_BEARER_AUTH)
export class SportFieldController {
  constructor(
    private readonly sportFieldService: SportFieldService,
    private readonly fieldService: FieldService,
    private readonly sportFieldImageService: SportFieldImageService,
    private readonly locationService: LocationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createSportField(
    @Body() createSportFieldDto: UpdateSportFieldDto,
    @User() user: any,
  ): Promise<BaseResponse<ReadSportFieldDto>> {
    console.log(createSportFieldDto);

    createSportFieldDto.createdBy = user.id;
    if (!createSportFieldDto.ownerId) {
      createSportFieldDto.ownerId = user.id;
    }

    console.log(createSportFieldDto);
    try {
      const res =
        await this.sportFieldService.createSportField(createSportFieldDto);
      if (!res) {
        throw new BadRequestException('sport_field_not_created');
      }

      // Emit event for location creation if locationObj is provided
      if (createSportFieldDto.location) {
        this.eventEmitter.emit(
          'create.location',
          new CreateLocationEvent(
            res.id,
            createSportFieldDto.location,
            res.createdBy,
          ),
        );
      }

      // Emit events for field creation
      for (let i = 0; i < createSportFieldDto.quantity; i++) {
        this.eventEmitter.emit(
          'create.field',
          new CreateFieldEvent(`Field - ${i + 1}`, res.id, res.createdBy),
        );
      }

      // Emit events for image creation
      for (const image of createSportFieldDto.sportFieldImages) {
        this.eventEmitter.emit(
          'create.sportFieldImage',
          new CreateSportFieldImageEvent(res.id, image, res.createdBy),
        );
      }

      return new BaseResponse(
        [res],
        'sport_field_created',
        201,
        new Date().toString(),
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('me')
  async getUserSportFields(
    @User() user: ReadUserDTO,
    @PaginationParams() pagination: Pagination,
    @Query('sportFieldTypeId') sportFieldTypeId?: string,
  ): Promise<BaseResponse<ReadSportFieldDto>> {
    const sportFields = await this.sportFieldService.getUserSportFields(
      user.id,
      pagination,
      sportFieldTypeId,
    );
    return new BaseResponse(
      sportFields,
      'sport_field_found',
      200,
      new Date().toString(),
    );
  }

  @Get()
  // async getSportFields(
  //   @PaginationParams() pagination: Pagination,
  //   @FilteringParams([
  //     'name',
  //     'startTime',
  //     'endTime',
  //     'phone',
  //     'rule',
  //     'ownerId',
  //   ])
  //   filtering?: Filtering,
  //   @Query('sportFieldTypeId') sportFieldTypeId?: string,
  //   @Query('startTime') startTime?: string,
  //   @Query('endTime') endTime?: string,
  //   @Query('location') location?: string,
  // ): Promise<BaseResponse<ReadSportFieldDto>> {
  //   console.log(location, 'location');
  //   return this.sportFieldService.getSportFields(
  //     pagination,
  //     filtering,
  //     sportFieldTypeId,
  //     startTime,
  //     endTime,
  //     location,
  //   );
  // }
  async getSportFields(
    @Query(new ValidationPipe({ transform: true }))
    filter?: any,
  ) {
    const res = await this.sportFieldService.getSportFieldsWithFilter(filter);
    if (!res) {
      throw new BadRequestException('sport_field_not_found');
    }
    return res;
  }

  @Get('/by-times')
  async getAllSportFieldsByTimes(
    @PaginationParams() pagination?: Pagination,
    @Query('startTime') startTime?: Date,
    @Query('endTime') endTime?: Date,
    @Query('sportFieldTypeId') sportFieldTypeId?: string,
  ): Promise<BaseResponse<ReadSportFieldDto>> {
    const sportFields = await this.sportFieldService.getSportFieldByTime(
      startTime,
      endTime,
      pagination,
      sportFieldTypeId,
    );
    return new BaseResponse(
      sportFields,
      'sport_field_found',
      200,
      new Date().toString(),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const sportField = await this.sportFieldService.findSportFieldById(id);
    if (!sportField) {
      throw new BadRequestException('sport_field_not_found');
    }
    return new BaseResponse(
      sportField,
      'sport_field_found',
      200,
      new Date().toString(),
    );
  }

  @Patch(':id')
  async update(
    @User() user: ReadUserDTO,
    @Param('id') id: string,
    @Body() updateSportFieldDto: Partial<UpdateSportFieldDto>,
  ) {
    updateSportFieldDto.updatedBy = user.id;
    const res = await this.sportFieldService.updateSportField(
      id,
      updateSportFieldDto,
    );

    if (updateSportFieldDto.location) {
      if (updateSportFieldDto.location.id) {
        const { id, ...location } = updateSportFieldDto.location;
        this.eventEmitter.emit(
          'update.location',
          new UpdateLocationEvent(id, location),
        );
      } else {
        this.eventEmitter.emit(
          'create.location',
          new CreateLocationEvent(
            id,
            updateSportFieldDto.location,
            res.createdBy,
          ),
        );
      }
    }

    if (updateSportFieldDto.sportFieldImages) {
      updateSportFieldDto.sportFieldImages.forEach((image) => {
        this.eventEmitter.emit(
          'create.sportFieldImage',
          new CreateSportFieldImageEvent(id, image, res.createdBy),
        );
      });
    }

    if (updateSportFieldDto.removeImageIds) {
      updateSportFieldDto.removeImageIds.forEach((imageId) => {
        this.eventEmitter.emit(
          'remove.sportFieldImage',
          new RemoveSportFieldImageEvent(imageId),
        );
      });
    }

    if (!res) {
      throw new BadRequestException('sport_field_not_updated');
    }
    return new BaseResponse(
      [res],
      'sport_field_updated',
      200,
      new Date().toString(),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const res = await this.sportFieldService.deleteSportField(id);
    if (!res) {
      throw new BadRequestException('sport_field_not_deleted');
    }
    return new BaseResponse(
      null,
      'sport_field_deleted',
      200,
      new Date().toString(),
    );
  }
}
