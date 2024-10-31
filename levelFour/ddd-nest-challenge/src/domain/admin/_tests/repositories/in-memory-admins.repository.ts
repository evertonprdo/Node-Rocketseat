import { InMemoryUsersRepository } from './in-memory-users.repository'

import { Admin } from '../../entities/admin'
import { AdminsRepository } from '../../repositories/admins.repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email)

    if (!admin) {
      return null
    }

    return admin
  }

  async assign(admin: Admin) {
    this.items.push(admin)
  }
}
