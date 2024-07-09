import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { SignInDto } from '../dto/sign-in.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { KeycloakService } from '../api/auth';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private keycloakHost: string;
  private realms: string;

  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly keycloakService: KeycloakService,
  ) {
    this.keycloakHost = process.env.KEYCLOAK_HOST;
    this.realms = process.env.KEYCLOAK_REALMS;
  }
  async signIn(signInDto: SignInDto) {
    await this.populateEmailIfPhoneProvided(signInDto);

    const formData = this.createSignInFormData(signInDto);
    try {
      const response = await this.requestKeycloakToken(formData);

      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async populateEmailIfPhoneProvided(signInDto: SignInDto) {
    if (signInDto.phone && !signInDto.email) {
      const user = await this.userService.findOne({
        where: { phone: signInDto.phone },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      signInDto.email = user.email;
    }

    return signInDto;
  }

  private createSignInFormData(signInDto: SignInDto): URLSearchParams {
    const formData = new URLSearchParams();
    formData.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
    formData.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
    formData.append('username', signInDto.email);
    formData.append('password', signInDto.password);
    formData.append('grant_type', 'password');
    return formData;
  }

  private async requestKeycloakToken(formData: URLSearchParams) {
    return axios.post(
      `${this.keycloakHost}/realms/${this.realms}/protocol/openid-connect/token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  async signUp(createAuthDto: CreateAuthDto) {
    const { name, email, phone, password, role, accountType } = createAuthDto;
    const userExist = await this.userRepository.findOne({
      where: [{ phone: phone }, { email: email }],
    });
    if (userExist) {
      return {
        statusCode: 409,
        status: 'Error',
        message: 'Email or phone already exists',
      };
    }

    const signUpKeyClockInfo = {
      username: email,
      enabled: true,
      email,
      attributes: {
        FullName: name,
        phone,
      },
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    };
    const data = await this.keycloakService.getAccessTokenRealms();

    console.log(data.access_token);
    await this.keycloakService.signUpKeyCloak(
      signUpKeyClockInfo,
      data.access_token,
    );

    const user = await this.keycloakService.getUserIdKeyCloak(
      email,
      data.access_token,
    );
    console.log(user);
    const roleUser = await this.keycloakService.getRoleIdKeyCloak(
      data.access_token,
      role,
    );

    const userRole = [
      {
        id: roleUser.id,
        name: role,
      },
    ];

    await this.keycloakService.createRoleUserKeyCloak(
      user[0].id,
      data.access_token,
      userRole,
    );
    const newUser = this.mapper.map(createAuthDto, CreateAuthDto, UserEntity);
    newUser.id = user[0].id;
    const createdUser = await this.userRepository.save({
      ...newUser,
      createdBy: newUser.id,
    });

    const newAccount = new AccountEntity();
    newAccount.name = accountType;
    newAccount.user = createdUser;

    this.accountRepository.save({ ...newAccount, createdBy: newUser.id });

    return {
      status: 'Success',
      message: 'Success register',
    };
  }
}
