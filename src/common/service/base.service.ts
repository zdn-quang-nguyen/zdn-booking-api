import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async create(entity: T): Promise<T> {
    try {
      const createdEntity = await this.repository.save(entity);
      return createdEntity;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    try {
      return await this.repository.findOne(options);
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, options: FindOneOptions<T>, entity: T): Promise<T> {
    try {
      const res = await this.repository.update(
        id,
        entity as QueryDeepPartialEntity<T>,
      );
      if (res.affected === 0) throw new BadRequestException('Updated failed');
      return this.findOne(options);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string, options: FindOneOptions<T>): Promise<T> {
    try {
      await this.repository.softDelete(id);
      console.log(this.findOne(options));
      return this.findOne(options);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
