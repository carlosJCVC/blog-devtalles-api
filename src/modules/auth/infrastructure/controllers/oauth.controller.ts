import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@src/common/decorators/public.decorator';
import { ZodBody } from '@src/common/decorators/zod-body.decorator';
import {
  type CompleteOAuthPayload,
  CompleteOAuthSchema,
} from '../../application/schemas/oauth.schema';
import { DiscordOAuthService } from '../services/discord-oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly discordOAuthService: DiscordOAuthService) {}

  @Public()
  @Post('discord')
  @HttpCode(HttpStatus.OK)
  async completeOAuth(
    @ZodBody(CompleteOAuthSchema) payload: CompleteOAuthPayload,
  ) {
    return this.discordOAuthService.completeOAuth(payload);
  }
}
