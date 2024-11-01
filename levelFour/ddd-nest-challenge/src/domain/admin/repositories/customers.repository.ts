import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Customer } from '../entities/customer'

export interface CustomersRepository {
  findByEmail(email: string): Promise<Customer | null>
  findById(id: string): Promise<Customer | null>
  findMany(params: PaginationParams): Promise<Customer[]>
  create(customer: Customer): Promise<void>
  save(customer: Customer): Promise<void>
  delete(customer: Customer): Promise<void>
}
