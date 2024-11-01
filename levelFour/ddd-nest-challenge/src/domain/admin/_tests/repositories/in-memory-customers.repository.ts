import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Customer } from '../../entities/customer'
import { CustomersRepository } from '../../repositories/customers.repository'

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = []

  async findById(id: string) {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }

  async findByEmail(email: string) {
    const customer = this.items.find((item) => item.email === email)

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
