import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

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

  async findMany({ page }: PaginationParams) {
    const take = 20
    const users = this.items.slice((page - 1) * take, page * take)

    return users
  }

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items.splice(itemIndex, 1)
  }
}
