import { AuthUserDto } from './auth.dto';

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  user: AuthUserDto;

  expiresAt: Date;
}
