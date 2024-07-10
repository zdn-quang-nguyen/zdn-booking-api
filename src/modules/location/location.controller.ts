import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_BEARER_AUTH, ROLE } from 'src/constants/constants';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';
import { Public, Roles } from 'nest-keycloak-connect';
import { BaseResponse } from 'src/common/response/base.response';
import { LocationEntity } from './entities/location.entity';
import { WardEntity } from './entities/ward.entity';
import { DistrictEntity } from './entities/district.entity';
import { ProvinceEntity } from './entities/province.entity';
@ApiTags('location')
@Controller('location')
@ApiBearerAuth(API_BEARER_AUTH)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get('location')
  async getLocation(@Query('address') address: string, @Res() res) {
    try {
      const location =
        await this.locationService.findLocationByAddress(address);
      return res.status(HttpStatus.OK).json(location);
    } catch (error: any) {
      return res.status(error.getStatus()).json({ message: error.message });
    }
  }

  @Public()
  @Get('address')
  async getLocationsByAddress(@Query('address') address: string, @Res() res) {
    try {
      const location =
        await this.locationService.getListLocationByAddress(address);
      return res.status(HttpStatus.OK).json(location);
    } catch (error: any) {
      return res.status(error.getStatus()).json({ message: error.message });
    }
  }

  @Post()
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<BaseResponse<LocationEntity>> {
    const res = this.locationService.create(createLocationDto);
    if (!res) {
      throw new BadRequestException('location_not_created');
    }
    return new BaseResponse(
      res,
      'location_created',
      201,
      new Date().toString(),
    );
  }

  @Get()
  @Roles({
    roles: [ROLE.OWNER],
  })
  async findAll(): Promise<BaseResponse<LocationEntity>> {
    const res = await this.locationService.findAll();
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('provinces')
  async findAllProvince(): Promise<BaseResponse<ProvinceEntity>> {
    const res = await this.locationService.findAllProvince();
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('districts')
  async findAllDistrict(): Promise<BaseResponse<DistrictEntity>> {
    const res = await this.locationService.findAllDistrict();
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('ward')
  async findAllWard() {
    const res = await this.locationService.findAllWard();
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('province/:id')
  async findByProvince(
    @Param('id') id: string,
  ): Promise<BaseResponse<ProvinceEntity>> {
    const res = await this.locationService.findByProvince(id);
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('district/:id')
  async findByDistrict(
    @Param('id') id: string,
  ): Promise<BaseResponse<DistrictEntity>> {
    const res = await this.locationService.findByDistrict(id);
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('ward/:id')
  async findByWard(@Param('id') id: string): Promise<BaseResponse<WardEntity>> {
    const res = await this.locationService.findByWard(id);
    if (!res) {
      throw new BadRequestException('location_not_retrieved');
    }
    return new BaseResponse(
      res,
      'location_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: Partial<UpdateLocationDto>,
  ): Promise<BaseResponse<LocationEntity>> {
    const res = await this.locationService.update(id, updateLocationDto);
    if (!res) {
      throw new BadRequestException('location_not_updated');
    }
    return new BaseResponse(
      res,
      'location_updated',
      200,
      new Date().toString(),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<BaseResponse<string>> {
    const res = await this.locationService.remove(id);
    if (!res) {
      throw new BadRequestException('location_not_removed');
    }
    return new BaseResponse(
      res,
      'location_removed',
      200,
      new Date().toString(),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<BaseResponse<LocationEntity>> {
    const res = await this.locationService.findOne(id);
    if (!res) {
      throw new BadRequestException('location_not_found');
    }
    return new BaseResponse(res, 'location_found', 200, new Date().toString());
  }
}
