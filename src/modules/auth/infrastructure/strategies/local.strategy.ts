import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@src/modules/users/domain/entities/user.entity';
import { Strategy } from 'passport-local';
import { ValidateUserUseCase } from '../../application/use-cases/queries/validate-user.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    super({
      usernameField: 'identifier', // Can be email or username
      passwordField: 'password',
    });
  }

  validate(identifier: string, password: string): Promise<UserEntity> {
    return this.validateUserUseCase.execute(identifier, password);
  }
}
