import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EngineDiagnosticsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  faultCodes?: string[];

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  rpm?: number;
}

export class IngestTelemetryDto {
  @IsString()
  vehicleId: string;

  @IsDateString()
  recordedAt: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim().endsWith('%')) {
      return Number(value.trim().slice(0, -1));
    }

    return value;
  })
  @IsNumber()
  batteryLevel?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EngineDiagnosticsDto)
  engineDiagnostics?: EngineDiagnosticsDto;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
