import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AlertResponse {
  _id: string;
  vehicleId: string;
  type: string;
  message: string;
  resolvedAt: Date | null;
}

export interface RecalibrateResponse {
  vehicleId: string;
  recalibrated: boolean;
  clearedAlerts: number;
}

@Injectable()
export class AlertingService {
  private readonly serviceUrl: string;
  private readonly serviceToken: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceUrl = this.configService.get<string>('ALERTING_SERVICE_URL') || 'http://localhost:3001';
    this.serviceToken = this.configService.get<string>('ALERTING_SERVICE_TOKEN') || '';
  }

  findActiveForVehicle(vehicleId: string): Promise<AlertResponse[]> {
    return this.request<AlertResponse[]>(
      `/internal/alerts/${encodeURIComponent(vehicleId)}`,
    );
  }

  recalibrateVehicle(vehicleId: string): Promise<RecalibrateResponse> {
    return this.request<RecalibrateResponse>(
      `/internal/admin/vehicles/${encodeURIComponent(vehicleId)}/force-recalibrate`,
      { method: 'POST' },
    );
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.serviceUrl}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${this.serviceToken}`,
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });

      if (!response.ok) {
        throw new ServiceUnavailableException(
          `Alerting service returned ${response.status}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      throw new ServiceUnavailableException('Alerting service is unavailable');
    }
  }
}
