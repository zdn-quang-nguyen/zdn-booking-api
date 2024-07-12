import { BookingService } from './../../booking/services/booking.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';

import { FieldEntity } from '../entities/field.entity';
import { CreateFieldDto } from '../dto/create-field.dto';
import { ReadFieldDto } from '../dto/read-field.dto';
import { UpdateFieldDto } from '../dto/update-field.dto';

@Injectable()
export class FieldService extends BaseService<FieldEntity> {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,
    private readonly bookingService: BookingService,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {
    super(fieldRepository);
  }

  async createField(createFieldDto: CreateFieldDto): Promise<ReadFieldDto> {
    const field = this.mapper.map(createFieldDto, CreateFieldDto, FieldEntity);
    const createdField = await this.create(field);
    return this.mapper.map(createdField, FieldEntity, ReadFieldDto);
  }

  async findFieldById(id: string): Promise<ReadFieldDto> {
    console.log(id);
    const field = await this.findOne({
      where: { id: id, deletedAt: IsNull() },
      relations: {
        sportField: {
          location: true,
        },
      },
    });
    console.log(field);
    return this.mapper.map(field, FieldEntity, ReadFieldDto);
  }

  async findFieldsBySportField(sportFieldId: string): Promise<ReadFieldDto[]> {
    const fields = await this.fieldRepository.find({
      where: { sportFieldId: sportFieldId },
      relations: ['sportField'],
    });
    return this.mapper.mapArray(fields, FieldEntity, ReadFieldDto);
  }

  async findFields(
    sportFieldID: string,
    startTime: Date,
    endTime: Date,
  ): Promise<ReadFieldDto[]> {
    const fields = await this.fieldRepository.find({
      where: {
        sportFieldId: sportFieldID,
      },
    });

    if (!fields) {
      return null;
    }

    const availableFields = await Promise.all(
      fields.map(async (field) => {
        if (
          await this.bookingService.hasBookingTime(field.id, startTime, endTime)
        ) {
          return null; // Return null for fields that have a booking time
        }
        return field; // Return the field if it doesn't have a booking time
      }),
    );

    return this.mapper.mapArray(
      availableFields.filter((field) => field !== null),
      FieldEntity,
      ReadFieldDto,
    );
  }

  async updateField(
    id: string,
    updateFieldDto: Partial<UpdateFieldDto>,
  ): Promise<ReadFieldDto> {
    const field = this.mapper.map(updateFieldDto, UpdateFieldDto, FieldEntity);
    const updatedField = await this.update(
      id,
      { where: { id: id, deletedAt: IsNull() } },
      field,
    );
    return this.mapper.map(updatedField, FieldEntity, ReadFieldDto);
  }

  async deleteField(id: string): Promise<ReadFieldDto> {
    const field = await this.findOne({
      where: { id: id, deletedAt: IsNull() },
    });
    if (!field) {
      return null;
    }
    const deletedField = await this.delete(id, {
      where: { id: id, deletedAt: Not(IsNull()) },
    });
    return this.mapper.map(deletedField, FieldEntity, ReadFieldDto);
  }
}
