import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CPF } from '@/core/entities/value-objects/cpf'

export interface UserProps {
  name: string
  cpf: CPF
  password: string
}

export class User<Props extends UserProps = UserProps> extends Entity<Props> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set name(name: string) {
    this.props.name = name
  }

  set cpf(cpf: CPF) {
    this.props.cpf = cpf
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new User(props, id)

    return user
  }
}
