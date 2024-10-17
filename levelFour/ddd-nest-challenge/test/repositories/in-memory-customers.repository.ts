import { PaginationParams } from '@/core/repositories/pagination-params'

import { Customer } from '@/domain/delivery/entities/customer'
import { CustomersRepository } from '@/domain/delivery/repositories/customers.repository'

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = []

  async findMany({ page }: PaginationParams) {
    const take = 20

    const customers = this.items.slice((page - 1) * take, page * take)

    return customers
  }

  async findById(id: string) {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }

  async findByEmail(email: string) {
    const customer = this.items.find((item) => item.email.toString() === email)

    if (!customer) {
      return null
    }

    return customer
  }

  async create(customer: Customer) {
    this.items.push(customer)
  }

  async save(customer: Customer) {
    const customerIndex = this.items.findIndex((item) =>
      item.id.equals(customer.id),
    )

    this.items[customerIndex] = customer
  }

  async delete(customer: Customer) {
    const customerIndex = this.items.findIndex((item) =>
      item.id.equals(customer.id),
    )

    this.items.splice(customerIndex, 1)
  }
}
