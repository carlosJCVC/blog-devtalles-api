import { BaseEntity } from '@src/common/domain/entities/base.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import {
  UserStatus as PrismaUserStatus,
  UserRole as PrismaUserRole,
} from '@prisma/client';

export class UserEntity extends BaseEntity {
  private _username: string;
  private _email: Email;
  private _password: Password;
  private _firstName?: string;
  private _lastName?: string;
  private _role: UserRole;
  private _status: UserStatus;
  private _avatar?: string;
  private _bio?: string;
  private _discordId?: string;
  private _emailVerifiedAt?: Date;
  private _lastLoginAt?: Date;
  private _refreshToken?: string;
  private _refreshTokenExpiresAt?: Date;

  private constructor(
    username: string,
    email: Email,
    password: Password,
    role: UserRole = UserRole.USER,
    status: UserStatus = UserStatus.ACTIVE,
    firstName?: string,
    lastName?: string,
    avatar?: string,
    bio?: string,
    discordId?: string,
    emailVerifiedAt?: Date,
    lastLoginAt?: Date,
    refreshToken?: string,
    refreshTokenExpiresAt?: Date,
    id?: number,
  ) {
    super(id);
    this._username = username;
    this._email = email;
    this._password = password;
    this._firstName = firstName;
    this._lastName = lastName;
    this._role = role;
    this._status = status;
    this._avatar = avatar;
    this._bio = bio;
    this._discordId = discordId;
    this._emailVerifiedAt = emailVerifiedAt;
    this._lastLoginAt = lastLoginAt;
    this._refreshToken = refreshToken;
    this._refreshTokenExpiresAt = refreshTokenExpiresAt;
  }

  static async create(
    username: string,
    email: string,
    plainPassword: string,
    firstName?: string,
    lastName?: string,
    role: UserRole = UserRole.USER,
  ): Promise<UserEntity> {
    const emailVO = new Email(email);
    const passwordVO = await Password.create(plainPassword);

    const user = new UserEntity(
      username,
      emailVO,
      passwordVO,
      role,
      UserStatus.ACTIVE,
      firstName,
      lastName,
    );

    // Add domain event here if needed
    // user.addDomainEvent(new UserRegisteredEvent(0, user.email, user.username));

    return user;
  }

  static reconstitute(data: {
    id?: number;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    bio?: string;
    discordId?: string;
    emailVerifiedAt?: Date;
    lastLoginAt?: Date;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): UserEntity {
    const emailVO = new Email(data.email);
    const passwordVO = Password.fromHash(data.password);

    const user = new UserEntity(
      data.username,
      emailVO,
      passwordVO,
      data.role,
      data.status,
      data.firstName,
      data.lastName,
      data.avatar,
      data.bio,
      data.discordId,
      data.emailVerifiedAt,
      data.lastLoginAt,
      data.refreshToken,
      data.refreshTokenExpiresAt,
      data.id,
    );

    // Restore state
    user._createdAt = data.createdAt;
    user._updatedAt = data.updatedAt;
    user._deletedAt = data.deletedAt;

    return user;
  }

  // Getters
  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email.getValue();
  }

  get emailVO(): Email {
    return this._email;
  }

  get password(): string {
    return this._password.getValue();
  }

  get passwordVO(): Password {
    return this._password;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get toPrismaStatus(): PrismaUserStatus {
    const map: Record<UserStatus, PrismaUserStatus> = {
      [UserStatus.ACTIVE]: PrismaUserStatus.ACTIVE,
      [UserStatus.PENDING]: PrismaUserStatus.PENDING,
      [UserStatus.SUSPENDED]: PrismaUserStatus.SUSPENDED,
    };

    return map[this._status];
  }

  get toPrismaRole(): PrismaUserRole {
    const map: Record<UserRole, PrismaUserRole> = {
      [UserRole.ADMIN]: PrismaUserRole.ADMIN,
      [UserRole.AUTHOR]: PrismaUserRole.AUTHOR,
      [UserRole.MODERATOR]: PrismaUserRole.MODERATOR,
      [UserRole.USER]: PrismaUserRole.USER,
    };

    return map[this._role];
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get discordId(): string | undefined {
    return this._discordId;
  }

  get emailVerifiedAt(): Date | undefined {
    return this._emailVerifiedAt;
  }

  get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  get refreshToken(): string | undefined | null {
    return this._refreshToken;
  }

  get refreshTokenExpiresAt(): Date | undefined | null {
    return this._refreshTokenExpiresAt;
  }

  // Domain methods
  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  isSuspended(): boolean {
    return this._status === UserStatus.SUSPENDED;
  }

  isEmailVerified(): boolean {
    return !!this._emailVerifiedAt;
  }

  hasRole(role: UserRole): boolean {
    return this._role === role;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  isModerator(): boolean {
    return this._role === UserRole.MODERATOR;
  }

  isAuthor(): boolean {
    return this._role === UserRole.AUTHOR;
  }

  getFullName(): string {
    if (!this._firstName && !this._lastName) {
      return this._username;
    }
    return `${this._firstName || ''} ${this._lastName || ''}`.trim();
  }

  updateLastLogin(): void {
    this._lastLoginAt = new Date();
  }

  setRefreshToken(token: string, expiresAt: Date): void {
    this._refreshToken = token;
    this._refreshTokenExpiresAt = expiresAt;
  }

  clearRefreshToken(): void {
    // this._refreshToken = null;
    // this._refreshTokenExpiresAt = null;

    this._refreshTokenExpiresAt = new Date(); // ALready expirado
    this._updatedAt = new Date();
  }

  isRefreshTokenValid(): boolean {
    const isValid = !!(
      this._refreshToken &&
      this._refreshTokenExpiresAt &&
      this._refreshTokenExpiresAt > new Date()
    );

    return isValid;
  }

  suspend(): void {
    this._status = UserStatus.SUSPENDED;
  }

  activate(): void {
    this._status = UserStatus.ACTIVE;
  }

  verifyEmail(): void {
    this._emailVerifiedAt = new Date();
  }

  async changePassword(newPlainPassword: string): Promise<void> {
    this._password = await Password.create(newPlainPassword);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return this._password.compare(plainPassword);
  }

  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
  }): void {
    if (data.firstName !== undefined) this._firstName = data.firstName;
    if (data.lastName !== undefined) this._lastName = data.lastName;
    if (data.bio !== undefined) this._bio = data.bio;
    if (data.avatar !== undefined) this._avatar = data.avatar;
  }

  linkDiscord(discordId: string): void {
    this._discordId = discordId;
  }

  unlinkDiscord(): void {
    this._discordId = undefined;
  }

  hasDiscordLinked(): boolean {
    return !!this._discordId;
  }

  isValid(): boolean {
    try {
      // Validate username
      if (
        !this._username ||
        this._username.length < 3 ||
        this._username.length > 50
      ) {
        return false;
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(this._username)) {
        return false;
      }

      // Email and password are validated by their value objects
      return true;
    } catch {
      return false;
    }
  }
}
