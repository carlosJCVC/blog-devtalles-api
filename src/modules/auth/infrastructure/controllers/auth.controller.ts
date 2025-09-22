import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { UserDto } from '@src/modules/users/application/dtos/user.dto';
import {
  DiscordRegisterSchema,
  RegisterSchema,
  type DiscordRegisterPayload,
  type RegisterPayload,
} from '../../application/schemas/register.schema';
import { ZodBody } from '@src/common/decorators/zod-body.decorator';
import {
  type DiscordLoginPayload,
  DiscordLoginSchema,
  type LoginPayload,
  LoginSchema,
} from '../../application/schemas/login.schema';
import { LoginResponseDto } from '../../application/dtos/login.dto';
import {
  type RefreshTokenPayload,
  RefreshTokenSchema,
} from '../../application/schemas/token.schema';
import { RefreshDto } from '../../application/dtos/refresh.dto';
import { UserProfileDto } from '../../application/dtos/profile.dto';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { Public } from '@src/common/decorators/public.decorator';
import { LocalAuthGuard } from '@src/common/guards/local-auth.guard';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { ZodParam } from '@src/common/decorators/zod-param.decorator';
import {
  discordId,
  DiscordIdParamSchema,
} from '../../application/schemas/param.schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @ZodBody(RegisterSchema) payload: RegisterPayload,
  ): Promise<UserDto> {
    return this.authService.register(payload);
  }

  @Public()
  @Post('register/discord')
  @HttpCode(HttpStatus.CREATED)
  async registerWithDiscord(
    @ZodBody(DiscordRegisterSchema) payload: DiscordRegisterPayload,
  ): Promise<UserDto> {
    return this.authService.registerWithDiscord(payload);
  }

  @Public()
  @Post('login')
  // @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @ZodBody(LoginSchema) payload: LoginPayload,
  ): Promise<LoginResponseDto> {
    this.logger.log(`GET /login - Query: ${JSON.stringify(payload)}`);

    return this.authService.login(payload);
  }

  @Public()
  @Post('login/discord')
  @HttpCode(HttpStatus.OK)
  async loginWithDiscord(
    @ZodBody(DiscordLoginSchema) payload: DiscordLoginPayload,
  ): Promise<LoginResponseDto> {
    return this.authService.loginWithDiscord(payload);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @ZodBody(RefreshTokenSchema) payload: RefreshTokenPayload,
  ): Promise<RefreshDto> {
    return this.authService.refreshToken(payload);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: UserEntity): Promise<void> {
    return this.authService.logout(user.id!);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserEntity): Promise<UserProfileDto> {
    return this.authService.getProfile(user.id!);
  }

  @Public()
  @Get('discord/check/:discordId')
  @HttpCode(HttpStatus.OK)
  async checkDiscordUser(
    @ZodParam('discordId', discordId) discordId: string,
  ): Promise<{ exists: boolean; user?: UserDto }> {
    this.logger.log(`GET /discord/check - Query: ${discordId}`);

    return this.authService.checkDiscordUserExists(discordId);
  }

  @Public()
  @Get('discord/validate/:discordId')
  @HttpCode(HttpStatus.OK)
  async validateDiscordUser(
    @ZodParam('discordId', discordId) discordId: string,
  ): Promise<UserDto> {
    this.logger.log(`GET /discord/validate - Query: ${discordId}`);

    return this.authService.validateDiscordUser(discordId);
  }
}
