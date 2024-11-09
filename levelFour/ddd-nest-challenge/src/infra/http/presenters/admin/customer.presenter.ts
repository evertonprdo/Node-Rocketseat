import { Customer } from '@/domain/admin/entities/customer'

export class CustomerPresenter {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id.toString(),
      userId: customer.userId.toString(),
      email: customer.email,
      cep: customer.address.cep.toDecorated(),
      state: customer.address.state,
      city: customer.address.city,
      street: customer.address.street,
      number: customer.address.number,
      neighborhood: customer.address.neighborhood,
    }
  }
}
