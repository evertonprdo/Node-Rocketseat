import { Admin } from '../../entities/admin'
import { AdminsRepository } from '../../repositories/admins.repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async assign(admin: Admin) {
    this.items.push(admin)
  }
}
