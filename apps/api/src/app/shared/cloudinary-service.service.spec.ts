import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryServiceService } from './cloudinary-service.service';

describe('CloudinaryServiceService', () => {
  let service: CloudinaryServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryServiceService],
    }).compile();

    service = module.get<CloudinaryServiceService>(CloudinaryServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
