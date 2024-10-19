import { User } from '../entities/user'

export interface UsersRepository {
  findByCPF(cpf: string): Promise<User | null>
  create(cpf: User): Promise<void>
}
