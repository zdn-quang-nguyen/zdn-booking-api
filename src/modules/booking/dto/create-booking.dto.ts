import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint } from 'src/common/validator/before.validator';
export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  fieldId: string;

  @IsNotEmpty()
  @IsDate()
  @Validate(IsBeforeConstraint, ['endTime'])
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
