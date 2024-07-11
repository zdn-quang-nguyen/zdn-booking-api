import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '../entities/booking.entity';

export class CreateOwnerBookingDto extends CreateBookingDto {
  @IsPhoneNumber('VN', { message: 'Phone number is invalid' })
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
