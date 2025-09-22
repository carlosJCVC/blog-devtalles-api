import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';
import { RefreshTokenPayload } from '../../schemas/token.schema';
import { RefreshDto } from '../../dtos/refresh.dto';
import { UserNotFoundException } from '@src/modules/users/domain/exceptions/user-not-found.exception';
import { InvalidRefreshTokenException } from '@src/modules/users/domain/exceptions/invalid-refresh-token.exception';

@Injectable()
export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: RefreshTokenPayload): Promise<RefreshDto> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find user
      const user = await this.usersRepository.findById(payload.sub);
      if (!user) {
        throw new UserNotFoundException();
      }

      // Validate stored refresh token
      if (
        !user.isRefreshTokenValid() ||
        user.refreshToken !== dto.refreshToken
      ) {
        throw new InvalidRefreshTokenException();
      }

      // Generate new access token
      const newPayload = {
        sub: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      return {
        accessToken,
        expiresAt,
      };
    } catch (error) {
      throw new InvalidRefreshTokenException();
    }
  }
}
