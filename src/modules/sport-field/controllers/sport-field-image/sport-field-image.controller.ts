import { API_BEARER_AUTH } from 'src/constants/constants';
import { SportFieldImageService } from './../../services/sport-field-image/sport-field-image.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';
import { CreateSportFieldImageDto } from '../../dto/sport-field-image/create-sport-field-image.dto';
import { BaseResponse } from 'src/common/response/base.response';
import { ReadSportFieldImageDto } from '../../dto/sport-field-image/read-sport-field-image.dto';

@ApiTags('sport-field-image')
@ApiBearerAuth(API_BEARER_AUTH)
@Public()
@Controller('sport-field-image')
export class SportFieldImageController {
  constructor(
    private readonly sportFieldImageService: SportFieldImageService,
  ) {}

  @Get('all')
  async findAllSportFieldImages(): Promise<
    BaseResponse<ReadSportFieldImageDto>
  > {
    const res = await this.sportFieldImageService.findAllSportFieldImages();
    if (res.length === 0) {
      throw new NotFoundException('sport_field_image_not_found');
    }
    return new BaseResponse(
      res,
      'sport_field_images_found',
      200,
      new Date().toString(),
    );
  }

  @Get('sport-field/:sportFieldId')
  async findSportFieldImagesBySportFieldId(
    @Param('sportFieldId') sportFieldId: string,
  ): Promise<BaseResponse<ReadSportFieldImageDto>> {
    const res =
      await this.sportFieldImageService.findSportFieldImagesBySportFieldId(
        sportFieldId,
      );
    if (res.length === 0) {
      throw new NotFoundException('sport_field_images_not_found');
    }
    return new BaseResponse(
      res,
      'sport_field_images_found',
      200,
      new Date().toString(),
    );
  }

  @Get(':id')
  async findSportFieldImageById(
    @Param('id') id: string,
  ): Promise<BaseResponse<ReadSportFieldImageDto>> {
    const res = await this.sportFieldImageService.findSportFieldImageById(id);
    if (!res) {
      throw new NotFoundException('sport_field_image_not_found');
    }
    return new BaseResponse(
      [res],
      'sport_field_image_found',
      200,
      new Date().toString(),
    );
  }

  @Post()
  async createSportFieldImage(
    @Body() createSportFieldImageDto: CreateSportFieldImageDto,
  ): Promise<BaseResponse<ReadSportFieldImageDto>> {
    const res = await this.sportFieldImageService.createSportFieldImage(
      createSportFieldImageDto,
    );
    if (!res) {
      throw new BadRequestException('sport_field_image_not_created');
    }
    return new BaseResponse(
      res,
      'sport_field_image_created',
      201,
      new Date().toString(),
    );
  }

  @Patch(':id')
  async updateSportFieldImage(
    @Param('id') id: string,
    @Body() updateSportFieldImageDto: CreateSportFieldImageDto,
  ): Promise<BaseResponse<ReadSportFieldImageDto>> {
    const res = await this.sportFieldImageService.updateSportFieldImage(
      id,
      updateSportFieldImageDto,
    );
    if (!res) {
      throw new BadRequestException('sport_field_image_update_failed');
    }
    return new BaseResponse(
      res,
      'sport_field_image_updated',
      200,
      new Date().toString(),
    );
  }

  @Delete('delete/:id')
  async deleteSportFieldImage(
    @Param('id') id: string,
  ): Promise<BaseResponse<ReadSportFieldImageDto>> {
    const res = await this.sportFieldImageService.deleteSportFieldImage(id);
    if (!res) {
      throw new BadRequestException('sport_field_image_delete_failed');
    }
    return new BaseResponse(
      res,
      'sport_field_image_deleted',
      200,
      new Date().toString(),
    );
  }
}
