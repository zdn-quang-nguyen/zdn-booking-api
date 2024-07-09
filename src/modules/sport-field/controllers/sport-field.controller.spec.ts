import { Test, TestingModule } from '@nestjs/testing';
import { SportFieldController } from './sport-field.controller';
import { SportFieldService } from '../services/sport-field.service';

describe('SportFieldController', () => {
  let controller: SportFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportFieldController],
      providers: [SportFieldService],
    }).compile();

    controller = module.get<SportFieldController>(SportFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
