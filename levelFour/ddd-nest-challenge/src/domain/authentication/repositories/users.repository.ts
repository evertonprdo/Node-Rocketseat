import { User } from '../entities/user'

export interface UsersRepository {
  findByCPF(cpf: string): Promise<User | null>
}
