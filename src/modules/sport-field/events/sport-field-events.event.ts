import { UploadImageDto } from 'src/common/dto/upload-image.dto';

export class CreateFieldEvent {
  constructor(
    public readonly name: string,
    public readonly sportFieldId: string,
    public readonly createdBy: string,
  ) {}
}

export class CreateSportFieldImageEvent {
  constructor(
    public readonly sportFieldId: string,
    public readonly image: UploadImageDto,
    public readonly createdBy: string,
  ) {}
}

export class CreateLocationEvent {
  constructor(
    public readonly sportFieldId: string,
    public readonly locationObj: any,
    public readonly createdBy: string,
  ) {}
}

export class UpdateLocationEvent {
  constructor(
    public readonly locationId: string,
    public readonly locationObj: any,
  ) {}
}

export class RemoveSportFieldImageEvent {
  constructor(public readonly imageId: string) {}
}
