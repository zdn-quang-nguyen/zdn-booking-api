import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  metadata: any;

  @IsUUID()
  receiverId: string;
}
