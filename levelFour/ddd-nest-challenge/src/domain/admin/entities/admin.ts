import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

import { CPF } from './value-objects/cpf'

interface AdminProps {
  name: string
  cpf: CPF
  password: string
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.cpf
  }

  get password() {
    return this.password
  }

  static create(props: AdminProps, id?: UniqueEntityId) {
    const student = new Admin(props, id)

    return student
  }
}
