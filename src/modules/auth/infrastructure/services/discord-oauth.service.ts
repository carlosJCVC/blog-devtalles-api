import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../application/services/auth.service';
import { CompleteOAuthPayload } from '../../application/schemas/oauth.schema';
import { LoginResponseDto } from '../../application/dtos/login.dto';

interface DiscordTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: string | null;
  global_name: string;
  avatar_decoration_data: string | null;
  collectibles: string | null;
  display_name_styles: string | null;
  banner_color: string | null;
  clan: string | null;
  primary_guild: string | null;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
  verified: boolean;
}

@Injectable()
export class DiscordOAuthService {
  private readonly logger = new Logger(DiscordOAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl = 'https://discord.com/api';

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.clientId = this.configService.getOrThrow<string>('DISCORD_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>(
      'DISCORD_CLIENT_SECRET',
    );
  }

  async completeOAuth(dto: CompleteOAuthPayload): Promise<LoginResponseDto> {
    try {
      const discordTokenResponse = await fetch(
        'https://discord.com/api/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id:
              this.configService.getOrThrow<string>('DISCORD_CLIENT_ID'),
            client_secret: this.configService.getOrThrow<string>(
              'DISCORD_CLIENT_SECRET',
            ),
            grant_type: 'authorization_code',
            code: dto.code,
            redirect_uri: dto.redirectUri,
          }),
        },
      );

      if (!discordTokenResponse.ok) {
        throw new BadRequestException(
          'Failed to exchange Discord code for token',
        );
      }

      const { access_token } =
        (await discordTokenResponse.json()) as DiscordTokenResponse;

      const discordUserResponse = await fetch(
        'https://discord.com/api/users/@me',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!discordUserResponse.ok) {
        throw new BadRequestException('Failed to get Discord user data');
      }

      const discordUser =
        (await discordUserResponse.json()) as DiscordUserResponse;

      const existingUser = await this.authService.checkDiscordUserExists(
        discordUser.id,
      );

      if (existingUser.exists) {
        return this.authService.loginWithDiscord({ discordId: discordUser.id });
      } else {
        await this.authService.registerWithDiscord({
          discordId: discordUser.id,
          username: `${discordUser.username}_${Math.random().toString(36).substring(2, 6)}`,
          email: discordUser.email || `${discordUser.id}@discord.placeholder`,
          firstName: discordUser.global_name || discordUser.username,
          avatar: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : undefined,
        });

        return this.authService.loginWithDiscord({ discordId: discordUser.id });
      }
    } catch (error) {
      this.logger.error('Discord OAuth error:', error);
      throw error;
    }
  }
}
