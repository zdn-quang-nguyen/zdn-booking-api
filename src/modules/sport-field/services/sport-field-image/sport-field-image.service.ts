import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { SportFieldImageEntity } from '../../entities/sport-field-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CreateSportFieldImageDto } from '../../dto/sport-field-image/create-sport-field-image.dto';
import { ReadSportFieldImageDto } from '../../dto/sport-field-image/read-sport-field-image.dto';

@Injectable()
export class SportFieldImageService extends BaseService<SportFieldImageEntity> {
  constructor(
    @InjectRepository(SportFieldImageEntity)
    private readonly sportFieldImageRepository: Repository<SportFieldImageEntity>,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {
    super(sportFieldImageRepository);
  }

  async createSportFieldImage(
    image: CreateSportFieldImageDto,
  ): Promise<ReadSportFieldImageDto> {
    const sportFieldImage: SportFieldImageEntity = this.mapper.map(
      image,
      CreateSportFieldImageDto,
      SportFieldImageEntity,
    );
    const createdSportFieldImage = await this.create(sportFieldImage);
    return this.mapper.map(
      createdSportFieldImage,
      SportFieldImageEntity,
      ReadSportFieldImageDto,
    );
  }

  async findAllSportFieldImages(): Promise<ReadSportFieldImageDto[]> {
    const sportFieldImages: SportFieldImageEntity[] = await this.findAll();
    return this.mapper.mapArray(
      sportFieldImages,
      SportFieldImageEntity,
      ReadSportFieldImageDto,
    );
  }

  async findSportFieldImagesBySportFieldId(
    sportFieldId: string,
  ): Promise<ReadSportFieldImageDto[]> {
    const sportFieldImages: SportFieldImageEntity[] =
      await this.sportFieldImageRepository.find({
        where: { sportField: { id: sportFieldId } },
      });
    return this.mapper.mapArray(
      sportFieldImages,
      SportFieldImageEntity,
      ReadSportFieldImageDto,
    );
  }

  async findSportFieldImageById(id: string): Promise<ReadSportFieldImageDto> {
    const sportFieldImage = await this.findOne({ where: { id } });
    return this.mapper.map(
      sportFieldImage,
      SportFieldImageEntity,
      ReadSportFieldImageDto,
    );
  }

  async updateSportFieldImage(
    id: string,
    image: CreateSportFieldImageDto,
  ): Promise<ReadSportFieldImageDto> {
    const sportFieldImage = this.mapper.map(
      image,
      CreateSportFieldImageDto,
      SportFieldImageEntity,
    );
    const updatedSportFieldImage = await this.update(
      id,
      { where: { id } },
      sportFieldImage,
    );
    return this.mapper.map(
      updatedSportFieldImage,
      SportFieldImageEntity,
      ReadSportFieldImageDto,
    );
  }

  async deleteSportFieldImage(id: string): Promise<ReadSportFieldImageDto> {
    const sportFieldImage = await this.findOne({
      where: { id: id, deletedAt: IsNull() },
    });
    if (!sportFieldImage) {
      return null;
    }

    const deleteSportFieldImage = await this.delete(id, {
      where: { id: id, deletedAt: Not(IsNull()) },
    });
    return this.mapper.map(
      deleteSportFieldImage,
      SportFieldImageEntity,
      ReadSportFieldImageDto,
    );
  }
}
