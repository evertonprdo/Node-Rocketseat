import { User } from '../entities/user'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByCPF(cpf: string): Promise<User | null>
  create(cpf: User): Promise<void>
}
