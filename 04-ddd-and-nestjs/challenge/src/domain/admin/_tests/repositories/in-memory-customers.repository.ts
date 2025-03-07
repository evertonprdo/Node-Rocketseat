import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { InMemoryUsersRepository } from './in-memory-users.repository'

import { Customer } from '../../entities/customer'
import { CustomerDetails } from '../../entities/values-objects/customer-details'

import { CustomersRepository } from '../../repositories/customers.repository'

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = []

  constructor(public usersRepository: InMemoryUsersRepository) {}

  async findById(id: string) {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }

  async findDetailsById(id: string): Promise<CustomerDetails | null> {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    const user = await this.usersRepository.findById(customer.userId.toString())

    if (!user) {
      throw new Error()
    }

    return CustomerDetails.create({
      customerId: customer.id,
      userId: user.id,
      cpf: user.cpf,
      name: user.name,
      email: customer.email,
      phone: user.phone,
      address: customer.address,
    })
  }

  async findByEmail(email: string) {
    const customer = this.items.find((item) => item.email === email)

    if (!customer) {
      return null
    }

    return customer
  }

  async findByUserId(id: string) {
    const customer = this.items.find((item) => item.userId.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }

  async findMany({ page }: PaginationParams) {
    const take = 20
    const customers = this.items.slice((page - 1) * take, page * take)

    return customers
  }

  async create(customer: Customer) {
    this.items.push(customer)
  }

  async save(customer: Customer) {
    const itemIndex = this.items.findIndex((item) => item.id === customer.id)

    this.items[itemIndex] = customer
  }

  async delete(customer: Customer) {
    const itemIndex = this.items.findIndex((item) => item.id === customer.id)

    this.items.splice(itemIndex, 1)
  }
}
