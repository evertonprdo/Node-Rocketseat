import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

export interface UserProps {
  name: string
  phone: string
  cpf: CPF
  password: string
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get phone() {
    return this.props.phone
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

  set phone(phone: string) {
    this.props.phone = phone
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
