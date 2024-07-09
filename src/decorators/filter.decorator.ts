import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Filtering {
  property: string;
  value: string;
}

export const FilteringParams = createParamDecorator(
  (data, ctx: ExecutionContext): Filtering => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    if (typeof data != 'object') {
      throw new BadRequestException('Invalid filter parameter');
    }

    const [property, value] = filter.split(':');
    if (!data.includes(property)) {
      throw new BadRequestException(`Invalid filter property: ${property}`);
    }

    return { property, value };
  },
);
