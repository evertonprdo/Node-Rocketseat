import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Address } from '@/domain/_shared/entities/value-objects/address'

export interface CustomerProps {
  name: string
  address: Address
}

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.props.name
  }

  get address() {
    return this.props.address
  }

  set name(name: string) {
    this.props.name = name
  }

  set address(address: Address) {
    this.props.address = address
  }

  static create(props: CustomerProps, id?: UniqueEntityId) {
    const customer = new Customer(props, id)

    return customer
  }
}
