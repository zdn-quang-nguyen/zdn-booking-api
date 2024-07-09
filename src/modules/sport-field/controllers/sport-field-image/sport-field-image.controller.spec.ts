import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldImageController } from './sport-field-image.controller';

describe('SportFieldImageController', () => {
  let controller: SportFieldImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportFieldImageController],
    }).compile();

    controller = module.get<SportFieldImageController>(SportFieldImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
