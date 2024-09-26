import { Injectable } from '@nestjs/common';
import IGenderic from 'src/interfaces/generic.interface';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

interface WithId {
  id: number;
}

@Injectable()
export class CRUDRepository<T extends WithId> implements Partial<IGenderic<T>> {
  constructor(protected repository: Repository<T>) {}
  async getAll(page: number, limit: number): Promise<T[]> {
    return await this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
  async getById(id: number): Promise<T> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }
  async create(item: DeepPartial<T>): Promise<T> {
    const createdItem = await this.repository.create(item);
    return await this.repository.save(createdItem);
  }
  async update(id: number, item: DeepPartial<T>): Promise<T | null> {
    const response = await this.repository.preload({ id, ...item });
    return await this.repository.save(response);
  }
  async delete(id: number): Promise<T> {
    const response = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    return this.repository.remove(response);
  }
}
