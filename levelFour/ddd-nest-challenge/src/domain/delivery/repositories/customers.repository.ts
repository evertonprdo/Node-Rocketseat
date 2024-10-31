import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { Customer } from '../entities/customer'

export interface CustomersRepository {
  findMany(params: PaginationParams): Promise<Customer[]>
  findById(id: string): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  create(customer: Customer): Promise<void>
  save(customer: Customer): Promise<void>
  delete(customer: Customer): Promise<void>
}
