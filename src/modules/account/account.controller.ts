import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { API_BEARER_AUTH } from 'src/constants/constants';
@ApiTags('account')
@Controller('account')
@ApiBearerAuth(API_BEARER_AUTH)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}
