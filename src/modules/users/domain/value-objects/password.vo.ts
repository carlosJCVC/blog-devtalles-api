import * as bcrypt from 'bcrypt';

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static async create(plainPassword: string): Promise<Password> {
    if (!this.isValidPlain(plainPassword)) {
      throw new Error(
        'Password must be at least 8 characters long and contain letters and numbers',
      );
    }

    const saltRounds = 12;
    const hashedValue = await bcrypt.hash(plainPassword, saltRounds);
    return new Password(hashedValue);
  }

  static fromHash(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.hashedValue);
  }

  getValue(): string {
    return this.hashedValue;
  }

  private static isValidPlain(password: string): boolean {
    // At least 8 characters, contain letters and numbers
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasLetter && hasNumber;
  }
}
