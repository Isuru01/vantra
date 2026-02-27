export function isPlausibleCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function isNotFuture(dateIso: string, toleranceMs = 60_000): boolean {
  return new Date(dateIso).getTime() <= Date.now() + toleranceMs;
}
