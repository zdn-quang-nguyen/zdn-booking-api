/* eslint-disable @typescript-eslint/no-unused-vars */
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
    const field = await this.findOne({
      where: { id: id, deletedAt: IsNull() },
      relations: {
        sportField: true,
      },
    });
    return this.mapper.map(field, FieldEntity, ReadFieldDto);
  }

  async findFieldsBySportField(sportFieldId: string): Promise<ReadFieldDto[]> {
    const fields = await this.fieldRepository.find({
      where: { sportFieldId: sportFieldId },
      relations: ['sportField'],
    });
    return this.mapper.mapArray(fields, FieldEntity, ReadFieldDto);
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
