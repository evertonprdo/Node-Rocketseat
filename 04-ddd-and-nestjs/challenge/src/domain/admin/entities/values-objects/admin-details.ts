import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

interface AdminDetailsProps {
  userId: UniqueEntityId
  adminId: UniqueEntityId
  name: string
  phone: string
  cpf: CPF
  email: string
}

export class AdminDetails extends ValueObject<AdminDetailsProps> {
  get userId() {
    return this.props.userId
  }

  get adminId() {
    return this.props.adminId
  }

  get name() {
    return this.props.name
  }

  get phone() {
    return this.props.phone
  }

  get cpf() {
    return this.props.cpf
  }

  get email() {
    return this.props.email
  }

  static create(props: AdminDetailsProps) {
    return new AdminDetails(props)
  }
}
