import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Address } from '@/domain/_shared/entities/value-objects/address'

export interface ReceiverProps {
  name: string
  address: Address
}

export class Receiver extends Entity<ReceiverProps> {
  get name() {
    return this.props.name
  }

  get address() {
    return this.props.address
  }

  static create(props: ReceiverProps, id?: UniqueEntityId) {
    const receiver = new Receiver(props, id)

    return receiver
  }
}
