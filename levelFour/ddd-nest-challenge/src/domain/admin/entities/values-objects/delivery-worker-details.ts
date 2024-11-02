import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

interface DeliveryWorkerDetailsProps {
  userId: UniqueEntityId
  deliveryWorkerId: UniqueEntityId
  name: string
  phone: string
  cpf: CPF
  operationZone: string
}

export class DeliveryWorkerDetails extends ValueObject<DeliveryWorkerDetailsProps> {
  get userId() {
    return this.props.userId
  }

  get deliveryWorkerId() {
    return this.props.deliveryWorkerId
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

  get operationZone() {
    return this.props.operationZone
  }

  static create(props: DeliveryWorkerDetailsProps) {
    return new DeliveryWorkerDetails(props)
  }
}
