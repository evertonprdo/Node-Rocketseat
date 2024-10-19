import { User } from '../../entities/user'
import { UsersRepository } from '../../repositories/users.repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByCPF(cpf: string) {
    const user = this.items.find((item) => item.cpf.value === cpf)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)
  }
}
