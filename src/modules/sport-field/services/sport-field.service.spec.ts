import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldService } from './sport-field.service';

describe('SportFieldService', () => {
  let service: SportFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportFieldService],
    }).compile();

    service = module.get<SportFieldService>(SportFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
