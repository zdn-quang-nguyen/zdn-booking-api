import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { API_BEARER_AUTH } from 'src/constants/constants';
import { FieldService } from './../services/field.service';

// import { FieldEntity } from '../entities/field.entity';
import { CreateFieldDto } from '../dto/create-field.dto';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { ReadFieldDto } from '../dto/read-field.dto';
import { BaseResponse } from 'src/common/response/base.response';
import { User } from 'src/decorators/user.decorator';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';

@ApiTags('field')
@ApiBearerAuth(API_BEARER_AUTH)
@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  async create(
    @Body() createFieldDto: CreateFieldDto,
  ): Promise<BaseResponse<ReadFieldDto>> {
    const field: ReadFieldDto =
      await this.fieldService.createField(createFieldDto);

    if (!field) {
      throw new BadRequestException('field_create_failed');
    }

    return new BaseResponse(field, 'field_created', 201, new Date().toString());
  }

  @Get()
  async findAll(
    @User() user: ReadUserDTO,
  ): Promise<BaseResponse<ReadFieldDto>> {
    console.log(user);
    const fields = await this.fieldService.findAll();

    if (!fields) {
      throw new NotFoundException('fields_not_found');
    }

    return new BaseResponse(
      fields,
      'fields_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponse<ReadFieldDto>> {
    const field: ReadFieldDto = await this.fieldService.findFieldById(id);

    if (!field) {
      throw new NotFoundException('field_not_found');
    }

    return new BaseResponse(
      field,
      'field_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Get('sport-field/:sportFieldId')
  async findFieldsBySportField(
    @Param('sportFieldId') sportFieldId: string,
  ): Promise<BaseResponse<ReadFieldDto>> {
    const fields: ReadFieldDto[] =
      await this.fieldService.findFieldsBySportField(sportFieldId);

    if (!fields) {
      throw new NotFoundException('field_not_found');
    }

    return new BaseResponse(
      fields,
      'fields_retrieved',
      200,
      new Date().toString(),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFieldDto: Partial<UpdateFieldDto>,
    @User() user: ReadUserDTO,
  ): Promise<BaseResponse<ReadFieldDto>> {
    updateFieldDto.updatedBy = user.id;
    const field: ReadFieldDto = await this.fieldService.updateField(
      id,
      updateFieldDto,
    );

    if (!field) {
      throw new BadRequestException('field_update_failed');
    }

    return new BaseResponse(field, 'field_updated', 200, new Date().toString());
  }

  @Delete(':id')
  async softDelete(
    @Param('id') id: string,
  ): Promise<BaseResponse<ReadFieldDto>> {
    const field: ReadFieldDto = await this.fieldService.deleteField(id);

    if (!field) {
      throw new BadRequestException('field_delete_failed');
    }

    return new BaseResponse(field, 'field_deleted', 200, new Date().toString());
  }
}
