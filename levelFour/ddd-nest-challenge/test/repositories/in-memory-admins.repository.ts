import { Admin } from '@/domain/delivery/entities/admin'
import { AdminsRepository } from '@/domain/delivery/repositories/admins.repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf.value === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin) {
    this.items.push(admin)
  }
}
