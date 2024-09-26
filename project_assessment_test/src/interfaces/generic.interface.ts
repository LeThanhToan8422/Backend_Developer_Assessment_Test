import { DeepPartial } from 'typeorm';

export default interface IGenderic<T> {
  getAll(page: number, limit: number): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(item: DeepPartial<T>): Promise<T>;
  update(id: number, item: DeepPartial<T>): Promise<T>;
  delete(id: number): Promise<T>;
}
