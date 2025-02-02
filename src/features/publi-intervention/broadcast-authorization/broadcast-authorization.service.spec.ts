import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BroadcastAuthorizationService } from './broadcast-authorization.service';
import { BroadcastAuthorization } from './entities/broadcast-authorization.entity';
import { Model } from 'mongoose';
import { CreateBroadcastAuthorizationDto } from './dto/create-broadcast-authorization.dto';

const mockBroadcastAuthorization = {
  _id: 'someId',
  announcer: 'someAnnouncerId',
  invoice: 'someInvoiceId',
  campaign: 'someCampaignId',
  nature: 'someNatureId',
  paymentMethod: 'somePaymentMethodId',
  validator: 'someValidatorId',
  adminValidator: 'someAdminValidatorId',
  commercials: ['someCommercialId'],
  productionPartner: 'someProductionPartnerId',
  keyContact: 'someKeyContactId',
  deleted: false,
};

const mockBroadcastAuthorizationModel = {
  create: jest.fn().mockResolvedValue(mockBroadcastAuthorization),
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(mockBroadcastAuthorization),
};

describe('BroadcastAuthorizationService', () => {
  let service: BroadcastAuthorizationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<BroadcastAuthorization>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastAuthorizationService,
        {
          provide: getModelToken(BroadcastAuthorization.name),
          useValue: mockBroadcastAuthorizationModel,
        },
      ],
    }).compile();

    service = module.get<BroadcastAuthorizationService>(
      BroadcastAuthorizationService,
    );
    model = module.get<Model<BroadcastAuthorization>>(
      getModelToken(BroadcastAuthorization.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a broadcast authorization', async () => {
    const dto: CreateBroadcastAuthorizationDto = {
      announcer: 'someAnnouncerId',
      invoice: 'someInvoiceId',
      campaign: 'someCampaignId',
      nature: 'someNatureId',
      natureDescription: 'someNatureDescription',
      date: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      paymentMethod: 'somePaymentMethodId',
      duration: 60,
      hour: '10:00',
      hours: ['10:00', '11:00'],
      realHours: ['10:00', '11:00'],
      realHour: '10:00',
      description: 'someDescription',
      participants: ['participant1', 'participant2'],
      questions: ['question1', 'question2'],
      note: 'someNote',
      serviceInCharge: 'someServiceInCharge',
      validator: 'someValidatorId',
      adminValidator: 'someAdminValidatorId',
      location: 'someLocation',
      commercials: ['someCommercialId'],
      contactDetails: 'someContactDetails',
      productionPartner: 'someProductionPartnerId',
      otherProductionPartner: 'someOtherProductionPartner',
      keyContact: 'someKeyContactId',
      otherKeyContact: 'someOtherKeyContact',
      contactDetailsToShow: 'someContactDetailsToShow',
    };
    const result = await service.create(dto);
    expect(result).toEqual(mockBroadcastAuthorization);
  });

  it('should find all broadcast authorizations', async () => {
    const paginationFilter = { page: 1, limit: 10, search: '', scope: 'all' };
    const result = await service.findAll(paginationFilter);
    expect(result).toEqual(mockBroadcastAuthorization);
  });

  it('should find one broadcast authorization', async () => {
    const result = await service.findOne('someId');
    expect(result).toEqual(mockBroadcastAuthorization);
  });

  it('should update a broadcast authorization', async () => {
    const dto = { ...mockBroadcastAuthorization };
    const result = await service.update('someId', dto);
    expect(result).toEqual(mockBroadcastAuthorization);
  });

  it('should soft delete a broadcast authorization', async () => {
    const result = await service.remove('someId');
    expect(result).toEqual(mockBroadcastAuthorization);
  });
});
