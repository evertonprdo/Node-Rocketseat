import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CourierProps {
  name: string
  operationCity: string
}

export class Courier extends Entity<CourierProps> {
  get operationCity() {
    return this.props.operationCity
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)

    return courier
  }
}
