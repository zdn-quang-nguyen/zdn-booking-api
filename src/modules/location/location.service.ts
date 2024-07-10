import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProvinceEntity } from './entities/province.entity';
import { DistrictEntity } from './entities/district.entity';
import { WardEntity } from './entities/ward.entity';
import { LocationEntity } from './entities/location.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import axios from 'axios';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
    @InjectRepository(ProvinceEntity)
    private provinceRepository: Repository<ProvinceEntity>,
    @InjectRepository(DistrictEntity)
    private districtRepository: Repository<DistrictEntity>,
    @InjectRepository(WardEntity)
    private wardRepository: Repository<WardEntity>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}
  private readonly apiKey = process.env.BING_MAP_KEY;

  async create(createLocationDto: CreateLocationDto): Promise<any> {
    try {
      const { longitude, latitude } = await this.findLocationByAddress(
        createLocationDto.addressDetail,
      );
      createLocationDto.latitude = latitude;
      createLocationDto.longitude = longitude;
      const entity = this.classMapper.map(
        createLocationDto,
        CreateLocationDto,
        LocationEntity,
      );
      return this.classMapper.mapAsync(
        await this.locationRepository.save(entity),
        LocationEntity,
        CreateLocationDto,
      );
    } catch (ex: any) {
      throw new Error(`create error: ${ex.message}.`);
    }
  }

  private async findProvinceById(id: string): Promise<ProvinceEntity> {
    return this.provinceRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  private async findDistrictById(id: string): Promise<DistrictEntity> {
    return this.districtRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  private async findWardById(id: string): Promise<WardEntity> {
    return this.wardRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAll() {
    const res = await this.locationRepository.find();
    return res ? res : null;
  }

  async findOne(id: string) {
    const res = await this.locationRepository.findOne({
      where: {
        id: id,
      },
    });
    return res ? res : 'Location not found!';
  }

  async update(id: string, updateLocationDto: Partial<UpdateLocationDto>) {
    // const entity = this.classMapper.map(
    //   updateLocationDto,
    //   UpdateLocationDto,
    //   LocationEntity,
    // );
    if (updateLocationDto.addressDetail) {
      const { latitude, longitude } = await this.findLocationByAddress(
        updateLocationDto.addressDetail,
      );
      updateLocationDto.latitude = latitude;
      updateLocationDto.longitude = longitude;
    }

    const res = await this.locationRepository.update(
      {
        id: id,
      },
      updateLocationDto,
    );

    return res.affected > 0
      ? await this.locationRepository.findOne({
          where: {
            id: id,
          },
        })
      : null;
  }

  async remove(id: string) {
    const res = await this.locationRepository.delete({
      id: id,
    });

    return res.affected > 0
      ? 'Location deleted successfully!'
      : 'Location not found!';
  }

  async findByDistrict(id: string) {
    const res = await this.districtRepository.find({
      where: {
        id: id,
      },
    });

    return res;
  }

  async findByProvince(id: string) {
    const res = await this.provinceRepository.find({
      where: {
        id: id,
      },
    });

    return res;
  }

  async findByWard(id: string) {
    const res = await this.wardRepository.find({
      where: {
        id: id,
      },
    });

    return res;
  }

  async findAllProvince() {
    return await this.provinceRepository.find();
  }

  async findAllDistrict() {
    return await this.districtRepository.find();
  }

  async findAllWard() {
    return await this.wardRepository.find();
  }

  async getListLocationByAddress(address: string) {
    try {
      const response = await axios.get(
        `http://dev.virtualearth.net/REST/v1/Locations`,
        {
          params: {
            query: address,
            key: this.apiKey,
          },
        },
      );

      const data = response.data;
      console.log(data);

      if (
        data &&
        data.resourceSets &&
        data.resourceSets.length > 0 &&
        data.resourceSets[0].resources.length > 0
      ) {
        const locations = data.resourceSets[0].resources.map(
          (resource: any) => {
            return {
              name: resource.address.addressLine,
              lat: resource.point.coordinates[0],
              lng: resource.point.coordinates[1],
              displayName: resource.address.formattedAddress,
            };
          },
        );
        return locations;
      } else {
        throw new HttpException('No location found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        `Error fetching location: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findLocationByAddress(
    address: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await axios.get(
        `http://dev.virtualearth.net/REST/v1/Locations`,
        {
          params: {
            query: address,
            key: this.apiKey,
          },
        },
      );

      const data = response.data;
      if (
        data &&
        data.resourceSets &&
        data.resourceSets.length > 0 &&
        data.resourceSets[0].resources.length > 0
      ) {
        const location = data.resourceSets[0].resources[0].point.coordinates;
        return { latitude: location[0], longitude: location[1] };
      } else {
        throw new HttpException('No location found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        `Error fetching location: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
