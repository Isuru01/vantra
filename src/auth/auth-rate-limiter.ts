import { HttpException, HttpStatus } from '@nestjs/common';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

export class AuthRateLimiter {
  private attempts = new Map<string, number[]>();

  checkAndRecord(email: string) {
    const now = Date.now();
    const history = (this.attempts.get(email) || []).filter((t) => now - t < WINDOW_MS);
    if (history.length >= MAX_ATTEMPTS) {
      throw new HttpException('Too many login attempts, try again shortly', HttpStatus.TOO_MANY_REQUESTS);
    }
    history.push(now);
    this.attempts.set(email, history);
  }
}
