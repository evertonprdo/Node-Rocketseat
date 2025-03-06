import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Customer } from '../entities/customer'
import { CustomerDetails } from '../entities/values-objects/customer-details'

export interface CustomersRepository {
  findById(id: string): Promise<Customer | null>
  findDetailsById(id: string): Promise<CustomerDetails | null>

  findByEmail(email: string): Promise<Customer | null>
  findByUserId(id: string): Promise<Customer | null>

  findMany(params: PaginationParams): Promise<Customer[]>

  create(customer: Customer): Promise<void>
  save(customer: Customer): Promise<void>
  delete(customer: Customer): Promise<void>
}
