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
import { DiscordLoginPayload } from '../../schemas/login.schema';
import { LoginResponseDto } from '../../dtos/login.dto';
import { UserNotFoundException } from '@src/modules/users/domain/exceptions/user-not-found.exception';
import { UserSuspendedException } from '@src/modules/users/domain/exceptions/user-suspended.exception';
import { UserLoggedInEvent } from '@src/modules/users/domain/events/user-logged-in.event';
import { UserMapper } from '@src/modules/users/application/mappers/user.mapper';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';

@Injectable()
export class DiscordLoginUseCase {
  private readonly logger = new Logger(DiscordLoginUseCase.name);

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

    @Inject(EVENT_BUS_TOKEN)
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: DiscordLoginPayload): Promise<LoginResponseDto> {
    // Find user by Discord ID
    const user = await this.usersRepository.findByDiscordId(dto.discordId);
    if (!user) {
      throw new UserNotFoundException(`Discord ID: ${dto.discordId}`);
    }

    // Check if user is suspended
    if (user.isSuspended()) {
      throw new UserSuspendedException(user.id?.toString());
    }

    // Generate tokens (always remember for Discord users)
    const { accessToken, refreshToken, expiresAt } = this.generateTokens(user);

    // Update user login info
    user.updateLastLogin();
    user.setRefreshToken(
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ); // 7 days

    // Save user
    await this.usersRepository.save(user);

    // Emit domain event
    await this.eventBus.publish(new UserLoggedInEvent(user.id!, user.email));

    return {
      user: UserMapper.fromEntityToDto(user),
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  private generateTokens(user: UserEntity): {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  } {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    return { accessToken, refreshToken, expiresAt };
  }
}
