import { DomainEvent } from '../events/domain-event.base';

export abstract class BaseEntity {
  protected _id?: number;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _deletedAt?: Date;

  private _domainEvents: DomainEvent[] = [];

  constructor(id?: number) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  // getters
  get id(): number | undefined {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get isDeleted(): boolean {
    return !!this._deletedAt;
  }

  // events
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  // soft deletes
  protected markAsUpdated(): void {
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = new Date();
    this.markAsUpdated();
  }

  restore(): void {
    this._deletedAt = undefined;
    this.markAsUpdated();
  }

  // comparation
  equals(entity: BaseEntity): boolean {
    if (!entity) return false;
    if (this === entity) return true;

    return this._id === entity._id;
  }

  // validation
  abstract isValid(): boolean;

  protected validateRequired(value: any, fieldName: string): void {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      throw new Error(`${fieldName} is required`);
    }
  }

  protected validateStringLength(
    value: string,
    fieldName: string,
    min?: number,
    max?: number,
  ): void {
    if (min && value.length < min) {
      throw new Error(`${fieldName} must be at least ${min} characters`);
    }
    if (max && value.length > max) {
      throw new Error(`${fieldName} cannot exceed ${max} characters`);
    }
  }
}
