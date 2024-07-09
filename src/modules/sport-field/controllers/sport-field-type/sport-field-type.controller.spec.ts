import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldTypeController } from './sport-field-type.controller';

describe('SportFieldTypeController', () => {
  let controller: SportFieldTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportFieldTypeController],
    }).compile();

    controller = module.get<SportFieldTypeController>(SportFieldTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
