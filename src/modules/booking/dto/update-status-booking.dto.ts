import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';
import { AutoMap } from '@automapper/classes';

export class UpdateStatusBookingDto {
  @AutoMap()
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
