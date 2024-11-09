import { CustomerDetails } from '@/domain/admin/entities/values-objects/customer-details'

export class CustomerDetailsPresenter {
  static toHTTP(customer: CustomerDetails) {
    return {
      userId: customer.userId.toString(),
      customerId: customer.customerId.toString(),
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
