import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { IsBeforeConstraint } from 'src/common/validator/before.validator';

export class ValidateBookingDto {
  @IsUUID()
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
}
