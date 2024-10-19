import { User } from '../entities/user'

export interface AccountsRepository {
  findByCPF(cpf: string): Promise<User | null>
  create(cpf: User): Promise<void>
}
