import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastAuthorizationService } from './broadcast-authorization.service';

describe('BroadcastAuthorizationService', () => {
  let service: BroadcastAuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BroadcastAuthorizationService],
    }).compile();

    service = module.get<BroadcastAuthorizationService>(
      BroadcastAuthorizationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
