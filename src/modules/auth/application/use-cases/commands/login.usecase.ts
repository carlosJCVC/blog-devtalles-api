import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  EVENT_BUS_TOKEN,
  type EventBus,
} from '@src/common/domain/events/event-bus.interface';
import {
  USERS_REPOSITORY_TOKEN,
  type UsersRepositoryInterface,
} from '@src/modules/users/domain/repositories/users.repository.interface';
import { LoginResponseDto } from '../../dtos/login.dto';
import { UserSuspendedException } from '@src/modules/users/domain/exceptions/user-suspended.exception';
import { UserLoggedInEvent } from '@src/modules/users/domain/events/user-logged-in.event';
import { UserMapper } from '@src/modules/users/application/mappers/user.mapper';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { LoginPayload } from '../../schemas/login.schema';
import { InvalidCredentialsException } from '@src/modules/users/domain/exceptions/invalid-credentials.exception';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: LoginPayload): Promise<LoginResponseDto> {
    this.logger.log(
      `Starting session for: "${dto.identifier}" and pass "${dto.password}"`,
    );

    // Find user by email or username
    const user = await this.findUserByIdentifier(dto.identifier);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Check if user is suspended
    if (user.isSuspended()) {
      throw new UserSuspendedException(user.id?.toString());
    }

    this.logger.log(`Generate tokens for user: ${user.getFullName()}`);

    // Generate tokens
    const { accessToken, refreshToken, expiresAt } = this.generateTokens(
      user,
      dto.rememberMe,
    );

    // Update user login info
    user.updateLastLogin();
    user.setRefreshToken(
      refreshToken,
      new Date(Date.now() + this.getRefreshTokenExpiry(dto.rememberMe)),
    );

    // Save user
    await this.usersRepository.save(user);

    // Emit domain event
    await this.eventBus.publish(new UserLoggedInEvent(user.id!, user.email));

    this.logger.log(`User logged in successfully: ${user.id}`);

    return {
      user: UserMapper.fromEntityToDto(user),
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  private async findUserByIdentifier(identifier: string): Promise<UserEntity> {
    // Try to find by email first
    if (identifier.includes('@')) {
      return this.usersRepository.findByEmail(identifier);
    }

    // Otherwise try username
    return this.usersRepository.findByUsername(identifier);
  }

  private generateTokens(
    user: UserEntity,
    rememberMe?: boolean,
  ): { accessToken: string; refreshToken: string; expiresAt: Date } {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessTokenExpiry = rememberMe ? '4h' : '1h';
    const refreshTokenExpiry = rememberMe ? '30d' : '7d';

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiry,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        expiresIn: refreshTokenExpiry,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );

    const expiresAt = new Date(
      Date.now() + (rememberMe ? 4 * 60 * 60 * 1000 : 60 * 60 * 1000),
    );

    return { accessToken, refreshToken, expiresAt };
  }

  private getRefreshTokenExpiry(rememberMe?: boolean): number {
    return rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days
  }
}
