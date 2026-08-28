import { ConfigService } from '@nestjs/config';
import { AlertingService } from './alerting.service';

describe('AlertingService HTTP client', () => {
  it('calls the standalone service with the internal token', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    const config = {
      get: jest.fn((key: string) => ({
        ALERTING_SERVICE_URL: 'http://localhost:3001',
        ALERTING_SERVICE_TOKEN: 'test-token',
      })[key]),
    } as unknown as ConfigService;
    const service = new AlertingService(config);

    await service.findActiveForVehicle('VH-00001');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/internal/alerts/VH-00001',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    );
    fetchMock.mockRestore();
  });
});
