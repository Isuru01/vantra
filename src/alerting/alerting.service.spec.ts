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

  it('raises a fresh alert once the previous one has been resolved', async () => {
    // No active (unresolved) alert found -> should NOT be suppressed even if
    // an earlier alert for this vehicle exists and was resolved.
    alertModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    alertModel.create.mockResolvedValue({ _id: 'new-alert' });
    const staleSince = new Date(Date.now() - 20 * 60 * 1000);
    const result = await service.checkVehicleOffline('v1', staleSince);
    expect(result).toEqual({ _id: 'new-alert' });
  });
});
