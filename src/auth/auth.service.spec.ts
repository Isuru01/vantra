import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  beforeEach(() => {
    userModel = {
      create: jest.fn(),
      findOne: jest.fn(),
    };
    jwtService = new JwtService({ secret: 'test-secret' });
    service = new AuthService(userModel, jwtService);
  });

  it('registers a new user with a hashed password', async () => {
    userModel.create.mockResolvedValue({ _id: 'abc123', email: 'a@b.com' });
    const result = await service.register('a@b.com', 'password123');
    expect(result).toEqual({ id: 'abc123', email: 'a@b.com' });
    expect(userModel.create).toHaveBeenCalled();
  });

  it('throws on login with unknown email', async () => {
    userModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    await expect(service.login('nope@b.com', 'x')).rejects.toThrow(UnauthorizedException);
  });

  it('throws on login with wrong password', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    userModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: '1', email: 'a@b.com', passwordHash }),
    });
    await expect(service.login('a@b.com', 'wrong-password')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
