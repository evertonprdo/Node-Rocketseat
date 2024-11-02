import { InMemoryUsersRepository } from './in-memory-users.repository'

import { Admin } from '../../entities/admin'
import { AdminDetails } from '../../entities/values-objects/admin-details'
import { AdminsRepository } from '../../repositories/admins.repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  constructor(public usersRepository: InMemoryUsersRepository) {}

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async findDetailsById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    const user = await this.usersRepository.findById(admin.userId.toString())

    if (!user) {
      throw new Error()
    }

    return AdminDetails.create({
      userId: user.id,
      adminId: admin.id,
      name: user.name,
      phone: user.phone,
      cpf: user.cpf,
      email: admin.email,
    })
  }

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

  async save(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[itemIndex] = admin
  }

  async unassign(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items.splice(itemIndex, 1)
  }
}
