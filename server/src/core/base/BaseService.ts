import { IRepository } from "../interfaces/IRepository";

export abstract class BaseService<T, CreateDTO, UpdateDTO> {
  constructor(protected readonly repository: IRepository<T, CreateDTO, UpdateDTO>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findAll(filter?: Record<string, unknown>): Promise<T[]> {
    return this.repository.findAll(filter);
  }

  async create(data: CreateDTO): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateDTO): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
