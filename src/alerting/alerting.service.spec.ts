import { AlertingService } from './alerting.service';

describe('AlertingService debounce', () => {
  let service: AlertingService;
  let alertModel: any;

  beforeEach(() => {
    alertModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };
    service = new AlertingService(alertModel);
  });

  it('does not raise a duplicate while an active alert already exists', async () => {
    alertModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: 'existing' }) });
    const staleSince = new Date(Date.now() - 20 * 60 * 1000);
    const result = await service.checkVehicleOffline('v1', staleSince);
    expect(result).toBeNull();
    expect(alertModel.create).not.toHaveBeenCalled();
  });

  it('suppresses repeat alerts for a flapping vehicle within the debounce window (VANTRA-441)', async () => {
    alertModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: 'recent' }) });
    const staleSince = new Date(Date.now() - 20 * 60 * 1000);
    const result = await service.checkVehicleOffline('v1', staleSince);
    expect(result).toBeNull();
  });
});
