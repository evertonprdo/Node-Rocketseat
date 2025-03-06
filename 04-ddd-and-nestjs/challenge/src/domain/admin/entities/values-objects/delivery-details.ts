import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Attachment } from '@/domain/_shared/entities/attachment'
import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { StatusKeys } from '@/domain/_shared/entities/types/delivery'
import { Address } from '@/domain/_shared/entities/value-objects/address'

export interface DeliveryDetailsProps {
  deliveryId: UniqueEntityId
  status: StatusKeys
  createdAt: Date
  pickedUpAt?: Date | null
  deliveredAt?: Date | null
  attachment?: Attachment | null
  updatedAt?: Date | null

  customer: {
    id: UniqueEntityId
    name: string
    email: string
    address: Address
  }

  deliveryWorker?: {
    id: UniqueEntityId
    name: string
    phone: string
    cpf: CPF
    operationZone: string
  } | null
}

export class DeliveryDetails extends ValueObject<DeliveryDetailsProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get pickedUpAt() {
    return this.props.pickedUpAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get attachment() {
    return this.props.attachment
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get customer() {
    return this.props.customer
  }

  get deliveryWorker() {
    return this.props.deliveryWorker
  }

  static create(props: DeliveryDetailsProps) {
    return new DeliveryDetails(props)
  }
}
