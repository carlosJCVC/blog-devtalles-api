export interface BaseRepositoryInterface<T> {
  create(entity: T): Promise<T>;

  findById(id: string): Promise<T | null>;

  delete(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;

  count(): Promise<number>;
}
