import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class NotificationFilterDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  read: boolean;
}
