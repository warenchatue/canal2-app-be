import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastAuthorizationController } from './broadcast-authorization.controller';

describe('BroadcastAuthorizationController', () => {
  let controller: BroadcastAuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastAuthorizationController],
    }).compile();

    controller = module.get<BroadcastAuthorizationController>(
      BroadcastAuthorizationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
