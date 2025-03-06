import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { Address } from '@/domain/_shared/entities/value-objects/address'

interface CustomerDetailsProps {
  userId: UniqueEntityId
  customerId: UniqueEntityId
  email: string
  name: string
  phone: string
  cpf: CPF

  address: Address
}

export class CustomerDetails extends ValueObject<CustomerDetailsProps> {
  get userId() {
    return this.props.userId
  }

  get customerId() {
    return this.props.customerId
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  get cpf() {
    return this.props.cpf
  }

  get address() {
    return this.props.address
  }

  static create(props: CustomerDetailsProps) {
    return new CustomerDetails(props)
  }
}
