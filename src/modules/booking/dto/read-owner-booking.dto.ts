import { IsNotEmpty, IsUUID } from 'class-validator';
import { ReadBookingDto } from './read-booking.dto';

export class ReadOwnerBookingDto extends ReadBookingDto {
  @IsUUID()
  @IsNotEmpty()
  fieldId: string;
}
