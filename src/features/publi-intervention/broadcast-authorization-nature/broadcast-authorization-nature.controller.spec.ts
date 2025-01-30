import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastAuthorizationNatureController } from './broadcast-authorization-nature.controller';

describe('BroadcastAuthorizationNatureController', () => {
  let controller: BroadcastAuthorizationNatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastAuthorizationNatureController],
    }).compile();

    controller = module.get<BroadcastAuthorizationNatureController>(
      BroadcastAuthorizationNatureController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
