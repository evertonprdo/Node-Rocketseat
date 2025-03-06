import { User } from '../entities/user'
import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByCPF(cpf: string): Promise<User | null>
  findMany(params: PaginationParams): Promise<User[]>
  create(user: User): Promise<void>
  save(user: User): Promise<void>
  delete(user: User): Promise<void>
}
