import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BroadcastAuthorizationNatureController } from './broadcast-authorization-nature.controller';
import { BroadcastAuthorizationNatureService } from './broadcast-authorization-nature.service';
import { BroadcastAuthorizationNature } from './entities/broadcast-authorization-nature.entity';

const mockBroadcastAuthorizationNatureModel = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  exec: jest.fn(),
};

describe('BroadcastAuthorizationNatureController', () => {
  let controller: BroadcastAuthorizationNatureController;
  let service: BroadcastAuthorizationNatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastAuthorizationNatureController],
      providers: [
        BroadcastAuthorizationNatureService,
        {
          provide: getModelToken(BroadcastAuthorizationNature.name),
          useValue: mockBroadcastAuthorizationNatureModel,
        },
      ],
    }).compile();

    controller = module.get<BroadcastAuthorizationNatureController>(
      BroadcastAuthorizationNatureController,
    );
    service = module.get<BroadcastAuthorizationNatureService>(
      BroadcastAuthorizationNatureService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
