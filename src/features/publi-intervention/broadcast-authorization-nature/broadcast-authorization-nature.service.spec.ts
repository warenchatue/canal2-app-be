import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BroadcastAuthorizationNatureService } from './broadcast-authorization-nature.service';
import { BroadcastAuthorizationNature } from './entities/broadcast-authorization-nature.entity';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationNatureDto } from './dto/create-broadcast-authorization-nature.dto';

const mockBroadcastAuthorizationNature = {
  _id: 'someId',
  name: 'someName',
  type: 'someType',
  program: 'someProgramId',
  deleted: false,
};

const mockBroadcastAuthorizationNatureModel = {
  create: jest.fn().mockResolvedValue(mockBroadcastAuthorizationNature),
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockBroadcastAuthorizationNature),
};

describe('BroadcastAuthorizationNatureService', () => {
  let service: BroadcastAuthorizationNatureService;
  let model: Model<BroadcastAuthorizationNature>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastAuthorizationNatureService,
        {
          provide: getModelToken(BroadcastAuthorizationNature.name),
          useValue: mockBroadcastAuthorizationNatureModel,
        },
      ],
    }).compile();

    service = module.get<BroadcastAuthorizationNatureService>(
      BroadcastAuthorizationNatureService,
    );
    model = module.get<Model<BroadcastAuthorizationNature>>(
      getModelToken(BroadcastAuthorizationNature.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a broadcast authorization nature', async () => {
    const dto: CreateBroadcastAuthorizationNatureDto = {
      name: 'someName',
      type: 'someType',
      program: 'someProgramId',
    };
    const result = await service.create(dto);
    expect(result).toEqual(mockBroadcastAuthorizationNature);
  });

  it('should find all broadcast authorization natures', async () => {
    const paginationFilter = { page: 1, limit: 10, search: '', scope: 'all' };
    const result = await service.findAll(paginationFilter);
    expect(result).toEqual(mockBroadcastAuthorizationNature);
  });

  it('should find one broadcast authorization nature', async () => {
    const result = await service.findOne('someId');
    expect(result).toEqual(mockBroadcastAuthorizationNature);
  });

  it('should update a broadcast authorization nature', async () => {
    const dto = { ...mockBroadcastAuthorizationNature };
    const result = await service.update('someId', dto);
    expect(result).toEqual(mockBroadcastAuthorizationNature);
  });

  it('should soft delete a broadcast authorization nature', async () => {
    const result = await service.remove('someId');
    expect(result).toEqual(mockBroadcastAuthorizationNature);
  });
});
