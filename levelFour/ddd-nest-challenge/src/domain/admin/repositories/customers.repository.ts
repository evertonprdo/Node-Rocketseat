import { Customer } from '../entities/customer'

export interface CustomersRepository {
  findById(id: string): Promise<Customer | null>
}
