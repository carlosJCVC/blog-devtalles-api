import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetUserByIdUseCase } from '@src/modules/users/application/use-cases/queries/get-user-by-id.usecase';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.getUserByIdUseCase.execute(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isTokenValid = user.isRefreshTokenValid();

    if (!isTokenValid) {
      throw new UnauthorizedException('User session has been terminated');
    }

    return user;
  }
}
