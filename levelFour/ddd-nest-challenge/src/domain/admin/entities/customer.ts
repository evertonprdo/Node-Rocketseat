import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Address } from './value-objects/address'

interface CustomerProps {
  name: string
  email: string
  address: Address
}

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.name
  }

  get email() {
    return this.email
  }

  get address() {
    return this.address
  }

  static create(props: CustomerProps, id?: UniqueEntityId) {
    const customer = new Customer(props, id)

    return customer
  }
}
