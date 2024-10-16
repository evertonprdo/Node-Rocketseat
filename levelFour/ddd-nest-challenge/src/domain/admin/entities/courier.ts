import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { Employee, EmployeeProps } from './employee'
import { Position } from './value-objects/location'

export interface CourierProps extends EmployeeProps {
  createdAt: Date
  lastPosition?: Position
  updatedAt?: Date
}

export class Courier extends Employee<CourierProps> {
  get createdAt() {
    return this.props.createdAt
  }

  get lastPosition() {
    return this.props.lastPosition
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  updatePosition(location: Position) {
    this.props.lastPosition = location

    this.touch()
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CourierProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courier = new Courier(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return courier
  }
}
