import { Test, TestingModule } from '@nestjs/testing';
import { TailorController } from './tailor.controller';
import { TailorService } from './tailor.service';

describe('TailorController', () => {
  let controller: TailorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TailorController],
      providers: [TailorService],
    }).compile();

    controller = module.get<TailorController>(TailorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
