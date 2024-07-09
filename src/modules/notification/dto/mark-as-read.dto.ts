import { IsString } from 'class-validator';

export class MarkAsReadDto {
  @IsString({ each: true })
  ids: string[];
}
