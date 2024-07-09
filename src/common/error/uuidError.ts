import { HttpException } from '@nestjs/common';

export async function UuidException(id: string): Promise<void> {
  if (id.length !== 24) {
    throw new HttpException(
      'Invalid id format, id must be must be a 24 character hex string',
      400,
    );
  }
}
