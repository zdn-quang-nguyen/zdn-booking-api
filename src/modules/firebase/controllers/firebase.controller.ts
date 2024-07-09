/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Get,
  Request,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../services/firebase.service';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';

@Controller('firebase')
@Public()
@ApiBearerAuth(API_BEARER_AUTH)
export class FirebaseController {
  constructor(private firebaseService: FirebaseService) {}

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    const res = await this.firebaseService.uploadImage(file, 'avatars');
    return res;
  }

  @Post('upload-sport-field-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSportFieldImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    const res = await this.firebaseService.uploadImage(file, 'sport-fields');
    return res;
  }
}
