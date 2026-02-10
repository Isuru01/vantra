import { IsDateString, IsNumber, IsString } from 'class-validator';

export class IngestTelemetryDto {
  @IsString()
  vehicleId: string;

  @IsDateString()
  recordedAt: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
