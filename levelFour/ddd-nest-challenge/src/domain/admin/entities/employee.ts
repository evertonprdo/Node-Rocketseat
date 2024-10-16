import { Entity } from '@/core/entities/entity'
import { CPF } from './value-objects/cpf'

export interface EmployeeProps {
  name: string
  cpf: CPF
  password: string
}

export abstract class Employee<
  Props extends EmployeeProps,
> extends Entity<Props> {
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

  set password(password: string) {
    this.props.password = password
  }
}
