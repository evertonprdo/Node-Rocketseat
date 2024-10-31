import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

interface UserProps {
  cpf: CPF
  password: string
}

export class User extends Entity<UserProps> {
  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new User(props, id)

    return user
  }
}
