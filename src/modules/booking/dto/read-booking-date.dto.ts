import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class ReadBookingDateDTO {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endTime: Date;
}
