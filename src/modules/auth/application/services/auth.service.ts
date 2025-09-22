import { Injectable } from '@nestjs/common';
import {
  DiscordRegisterPayload,
  RegisterPayload,
} from '../schemas/register.schema';
import { UserDto } from '@src/modules/users/application/dtos/user.dto';
import { RegisterUseCase } from '../use-cases/commands/register.usecase';
import { DiscordRegisterUseCase } from '../use-cases/commands/discord-register.usecase';
import { LoginUseCase } from '../use-cases/commands/login.usecase';
import { DiscordLoginUseCase } from '../use-cases/commands/discord-login.usecase';
import { RefreshTokenUseCase } from '../use-cases/commands/refresh-token.usecase';
import { LogoutUseCase } from '../use-cases/commands/logout.usecase';
import { GetUserProfileUseCase } from '../use-cases/queries/get-user-profile.usecase';
import { ValidateDiscordUserUseCase } from '../use-cases/queries/validate-discord-user.usecase';
import { UserMapper } from '@src/modules/users/application/mappers/user.mapper';
import { DiscordLoginPayload, LoginPayload } from '../schemas/login.schema';
import { LoginResponseDto } from '../dtos/login.dto';
import { RefreshTokenPayload } from '../schemas/token.schema';
import { RefreshDto } from '../dtos/refresh.dto';
import { UserProfileDto } from '../dtos/profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly discordRegisterUseCase: DiscordRegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly discordLoginUseCase: DiscordLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly validateDiscordUserUseCase: ValidateDiscordUserUseCase,
  ) {}

  async register(dto: RegisterPayload): Promise<UserDto> {
    const user = await this.registerUseCase.execute(dto);

    return UserMapper.fromEntityToDto(user);
  }

  async registerWithDiscord(dto: DiscordRegisterPayload): Promise<UserDto> {
    const user = await this.discordRegisterUseCase.execute(dto);

    return UserMapper.fromEntityToDto(user);
  }

  async login(dto: LoginPayload): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  async loginWithDiscord(dto: DiscordLoginPayload): Promise<LoginResponseDto> {
    return this.discordLoginUseCase.execute(dto);
  }

  async refreshToken(dto: RefreshTokenPayload): Promise<RefreshDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  async logout(userId: number): Promise<void> {
    return this.logoutUseCase.execute(userId);
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    return this.getUserProfileUseCase.execute(userId);
  }

  async validateDiscordUser(discordId: string): Promise<UserDto> {
    const user = await this.validateDiscordUserUseCase.execute(discordId);

    return UserMapper.fromEntityToDto(user);
  }

  async checkDiscordUserExists(
    discordId: string,
  ): Promise<{ exists: boolean; user?: UserDto }> {
    try {
      const user = await this.validateDiscordUserUseCase.execute(discordId);
      return {
        exists: true,
        user: UserMapper.fromEntityToDto(user),
      };
    } catch {
      return { exists: false };
    }
  }
}
