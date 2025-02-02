import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BroadcastAuthorizationController } from './broadcast-authorization.controller';
import { BroadcastAuthorizationService } from './broadcast-authorization.service';
import { BroadcastAuthorization } from './entities/broadcast-authorization.entity';

const mockBroadcastAuthorizationModel = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  exec: jest.fn(),
};

describe('BroadcastAuthorizationController', () => {
  let controller: BroadcastAuthorizationController;
  let service: BroadcastAuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastAuthorizationController],
      providers: [
        BroadcastAuthorizationService,
        {
          provide: getModelToken(BroadcastAuthorization.name),
          useValue: mockBroadcastAuthorizationModel,
        },
      ],
    }).compile();

    controller = module.get<BroadcastAuthorizationController>(
      BroadcastAuthorizationController,
    );
    service = module.get<BroadcastAuthorizationService>(
      BroadcastAuthorizationService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
