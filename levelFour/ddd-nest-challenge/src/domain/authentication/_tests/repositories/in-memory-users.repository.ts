import { User } from '../../entities/user'
import { UsersRepository } from '../../repositories/users.repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByCPF(cpf: string) {
    const user = this.items.find((item) => item.cpf.value === cpf)

    if (!user) {
      return null
    }

    return user
  }
}
