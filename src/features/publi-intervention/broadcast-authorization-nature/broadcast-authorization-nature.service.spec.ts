import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastAuthorizationNatureService } from './broadcast-authorization-nature.service';

describe('BroadcastAuthorizationNatureService', () => {
  let service: BroadcastAuthorizationNatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BroadcastAuthorizationNatureService],
    }).compile();

    service = module.get<BroadcastAuthorizationNatureService>(
      BroadcastAuthorizationNatureService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
