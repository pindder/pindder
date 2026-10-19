import { Test, TestingModule } from '@nestjs/testing';
import { BankDetailController } from './bank-detail.controller';
import { BankDetailService } from './bank-detail.service';

describe('BankDetailController', () => {
  let controller: BankDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankDetailController],
      providers: [BankDetailService],
    }).compile();

    controller = module.get<BankDetailController>(BankDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
