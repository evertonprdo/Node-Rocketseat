import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Address } from '@/domain/_shared/entities/value-objects/address'
import { CustomerProps } from '@/domain/delivery/entities/customer'

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get address() {
    return this.props.address
  }

  set name(name: string) {
    this.props.name = name
  }

  set email(email: string) {
    this.props.email = email
  }

  set address(address: Address) {
    this.props.address = address
  }

  static create(props: CustomerProps, id?: UniqueEntityId) {
    const customer = new Customer(props, id)

    return customer
  }
}
