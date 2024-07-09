import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, Validate } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';
import { IsBeforeConstraint } from 'src/common/validator/before.validator';

export class ReadBookingDto {
  @IsDate()
  @Type(() => Date)
  @Validate(IsBeforeConstraint, ['endTime'])
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(BookingStatus, { each: true, message: 'Invalid status' })
  @Transform(({ value }) => value?.split(','))
  status?: BookingStatus[];
}
