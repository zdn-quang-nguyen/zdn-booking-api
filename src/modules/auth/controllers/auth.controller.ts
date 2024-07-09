import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'nest-keycloak-connect';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth.service';

@Controller({ path: '/auth', version: '1' })
@ApiTags('auth')
@ApiBearerAuth(API_BEARER_AUTH)
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @Public()
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('/sign-up')
  @Public()
  signUp(@Body() createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    return this.authService.signUp(createAuthDto);
  }
}
