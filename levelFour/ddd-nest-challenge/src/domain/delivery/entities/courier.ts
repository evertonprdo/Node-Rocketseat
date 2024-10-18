import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Employee, EmployeeProps } from './employee'

export interface CourierProps extends EmployeeProps {
  operationCity: string
}

export class Courier extends Employee<CourierProps> {
  get operationCity() {
    return this.props.operationCity
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)

    return courier
  }
}
