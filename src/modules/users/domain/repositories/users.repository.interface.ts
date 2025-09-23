import { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY_TOKEN = 'CategoriesRepositoryInterface';

export interface UsersRepositoryInterface {
  findById(id: number): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity>;

  findByUsername(username: string): Promise<UserEntity>;

  findByRefreshToken(refreshToken: string): Promise<UserEntity>;

  findByDiscordId(discordId: string): Promise<UserEntity | null>;

  create(userData: Partial<UserEntity>): Promise<UserEntity>;

  save(user: UserEntity): Promise<UserEntity>;

  update(user: UserEntity): Promise<UserEntity>;

  delete(id: number): Promise<void>;

  existsByEmail(email: string): Promise<boolean>;

  existsByUsername(username: string): Promise<boolean>;
}
