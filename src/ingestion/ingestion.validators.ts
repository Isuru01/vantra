export function isPlausibleCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function isNotFuture(dateIso: string, toleranceMs = 60_000): boolean {
  return new Date(dateIso).getTime() <= Date.now() + toleranceMs;
}

export function isBatteryLevelValid(
  batteryLevel: number | undefined,
): boolean {
  return (
    batteryLevel === undefined ||
    (Number.isFinite(batteryLevel) &&
      batteryLevel >= 0 &&
      batteryLevel <= 100)
  );
}

export function isValidTemperature(
  temperature: number | undefined,
): boolean {
  return temperature === undefined || Number.isFinite(temperature);
}