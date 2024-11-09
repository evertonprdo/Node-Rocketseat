import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Address } from '@/domain/_shared/entities/value-objects/address'

export interface CustomerProps {
  userId: UniqueEntityId
  email: string
  address: Address
}

export class Customer extends Entity<CustomerProps> {
  get userId() {
    return this.props.userId
  }

  get email() {
    return this.props.email
  }

  get address() {
    return this.props.address
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
