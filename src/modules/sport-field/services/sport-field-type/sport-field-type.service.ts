import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { BaseService } from 'src/common/service/base.service';
import { CreateSportFieldTypeDto } from '../../dto/sport-field-type/create-sport-field-type.dto';
import { SportFieldTypeEntity } from '../../entities/sport-field-type.entity';
import { ReadSportFieldTypeDto } from '../../dto/sport-field-type/read-sport-field-type.dto';

@Injectable()
export class SportFieldTypeService extends BaseService<SportFieldTypeEntity> {
  constructor(
    @InjectRepository(SportFieldTypeEntity)
    private readonly sportFieldTypeRepository: Repository<SportFieldTypeEntity>,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {
    super(sportFieldTypeRepository);
  }

  async createSportFieldType(
    data: CreateSportFieldTypeDto,
  ): Promise<ReadSportFieldTypeDto> {
    const sportFieldType: SportFieldTypeEntity = this.mapper.map(
      data,
      CreateSportFieldTypeDto,
      SportFieldTypeEntity,
    );
    const createdSportFieldType = await this.create(sportFieldType);
    return this.mapper.map(
      createdSportFieldType,
      SportFieldTypeEntity,
      ReadSportFieldTypeDto,
    );
  }

  async findAllSportFieldType(): Promise<ReadSportFieldTypeDto[]> {
    const sportFieldTypes = await this.findAll();
    return this.mapper.mapArray(
      sportFieldTypes,
      SportFieldTypeEntity,
      ReadSportFieldTypeDto,
    );
  }

  async findAllSportFieldTypes(): Promise<ReadSportFieldTypeDto[]> {
    const sportFieldTypes = await this.findAll();
    return this.mapper.mapArray(
      sportFieldTypes,
      SportFieldTypeEntity,
      ReadSportFieldTypeDto,
    );
  }

  async findSportFieldTypeById(id: string): Promise<ReadSportFieldTypeDto> {
    const sportFieldType = await this.findOne({ where: { id } });
    return this.mapper.map(
      sportFieldType,
      SportFieldTypeEntity,
      ReadSportFieldTypeDto,
    );
  }

  async updateSportFieldType(
    id: string,
    data: CreateSportFieldTypeDto,
  ): Promise<ReadSportFieldTypeDto> {
    const sportFieldType = this.mapper.map(
      data,
      CreateSportFieldTypeDto,
      SportFieldTypeEntity,
    );
    const updatedSportFieldType = await this.update(
      id,
      { where: { id } },
      sportFieldType,
    );
    return this.mapper.map(
      updatedSportFieldType,
      SportFieldTypeEntity,
      ReadSportFieldTypeDto,
    );
  }

  async deleteSportFieldType(id: string): Promise<ReadSportFieldTypeDto> {
    const sportFieldType = await this.findOne({
      where: { id: id, deletedAt: IsNull() },
    });
    if (!sportFieldType) {
      return null;
    }
    const deletedSportFieldType = await this.delete(id, {
      where: { id: id, deletedAt: Not(IsNull()) },
    });
    return this.mapper.map(
      deletedSportFieldType,
      SportFieldTypeEntity,
      ReadSportFieldTypeDto,
    );
  }
}
