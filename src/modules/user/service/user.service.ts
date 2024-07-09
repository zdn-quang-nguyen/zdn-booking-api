import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { KeycloakService } from 'src/modules/auth/api/auth';
import { ReadUserDTO } from '../dto/read-user-dto';
import { CreateSocialUserDto } from '../dto/create-social-user.dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectMapper()
    private readonly classMapper: Mapper,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly keycloakService: KeycloakService,
  ) {
    super(userRepository);
  }

  async updateProfile(id: string, data: UpdateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: [{ id: id }],
    });
    if (!userExist) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'User not exists',
      };
    }

    const dataToken = await this.keycloakService.getAccessTokenRealms();

    const dataBody = {
      attributes: {
        phone: data.phone,
        FullName: data.name,
      },
    };
    await this.keycloakService.updateUserKeyCloak(
      id,
      dataBody,
      dataToken.access_token,
    );
    await this.userRepository.update(id, data);
    return {
      statusCode: 200,
      status: 'Success',
      message: 'Updated successfully',
      data,
    };
  }

  async createSocialUser(
    user: ReadUserDTO,
    createSocialUserDto: CreateSocialUserDto,
  ) {
    console.log('🚀 ~ UserService ~ createSocialUserDto:', createSocialUserDto);
    console.log('🚀 ~ UserService ~ user:', user);

    const userExist = await this.userRepository.findOne({
      where: [{ id: user.id }],
    });

    if (userExist) {
      return userExist;
    }
    const dataToken = await this.keycloakService.getAccessTokenRealms();
    const roleUser = await this.keycloakService.getRoleIdKeyCloak(
      dataToken.access_token,
      createSocialUserDto.role,
    );
    const userRole = [
      {
        id: roleUser.id,
        name: createSocialUserDto.role,
      },
    ];

    await this.keycloakService.createRoleUserKeyCloak(
      user.id,
      dataToken.access_token,
      userRole,
    );
    try {
      await this.userRepository.save({
        ...user,
        role: createSocialUserDto.role,
        createdBy: user.id,
      });
    } catch (error) {
      console.log('🚀 ~ UserService ~ error:', error);
    }
    return user;
  }
}
