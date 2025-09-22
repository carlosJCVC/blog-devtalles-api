import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@src/database/database.module';
import { AuthService } from './application/services/auth.service';
import { LoginUseCase } from './application/use-cases/commands/login.usecase';
import { RegisterUseCase } from './application/use-cases/commands/register.usecase';
import { DiscordRegisterUseCase } from './application/use-cases/commands/discord-register.usecase';
import { DiscordLoginUseCase } from './application/use-cases/commands/discord-login.usecase';
import { RefreshTokenUseCase } from './application/use-cases/commands/refresh-token.usecase';
import { LogoutUseCase } from './application/use-cases/commands/logout.usecase';
import { ValidateUserUseCase } from './application/use-cases/queries/validate-user.usecase';
import { GetUserProfileUseCase } from './application/use-cases/queries/get-user-profile.usecase';
import { GetUserByIdUseCase } from '../users/application/use-cases/queries/get-user-by-id.usecase';
import { ValidateDiscordUserUseCase } from './application/use-cases/queries/validate-discord-user.usecase';
import { PrismaUsersRepository } from '../users/infrastructure/repositories/prisma-users.repository';
import { USERS_REPOSITORY_TOKEN } from '../users/domain/repositories/users.repository.interface';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './infrastructure/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    AuthService,

    // Use Cases - Commands
    LoginUseCase,
    RegisterUseCase,
    DiscordRegisterUseCase,
    DiscordLoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    ValidateUserUseCase,
    GetUserProfileUseCase,
    GetUserByIdUseCase,
    ValidateDiscordUserUseCase,

    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: PrismaUsersRepository,
    },

    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
