import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldImageService } from './sport-field-image.service';

describe('SportFieldImageService', () => {
  let service: SportFieldImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportFieldImageService],
    }).compile();

    service = module.get<SportFieldImageService>(SportFieldImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
