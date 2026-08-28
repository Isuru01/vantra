import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const expectedToken = this.configService.get<string>(
      'ALERTING_SERVICE_TOKEN',
    );

    if (
      !expectedToken ||
      authorization !== `Bearer ${expectedToken}`
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}