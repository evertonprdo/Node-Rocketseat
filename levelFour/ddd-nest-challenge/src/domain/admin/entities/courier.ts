import { Entity } from '@/core/entities/entity'
import { CPF } from './value-objects/cpf'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface CourierProps {
  name: string
  cpf: CPF
  password: string
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)

    return courier
  }
}
