import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldTypeService } from './sport-field-type.service';

describe('SportFieldTypeService', () => {
  let service: SportFieldTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportFieldTypeService],
    }).compile();

    service = module.get<SportFieldTypeService>(SportFieldTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
