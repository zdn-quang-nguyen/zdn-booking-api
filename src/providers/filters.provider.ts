import { HttpExceptionFilter } from '../common/error/http-exception.filter';
import { AllExceptionsFilter } from '../common/error/all-exception.filter';
import { APP_FILTER } from '@nestjs/core';

export const FiltersProvider = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
];
