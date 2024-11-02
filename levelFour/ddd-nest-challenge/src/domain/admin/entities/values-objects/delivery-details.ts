import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { StatusKeys } from '@/domain/_shared/entities/types/delivery'
import { Address } from '@/domain/_shared/entities/value-objects/address'
import { DeliveryAttachment } from '@/domain/_shared/entities/delivery-attachment'

export interface DeliveryDetailsProps {
  deliveryId: UniqueEntityId
  status: StatusKeys
  createdAt: Date
  pickedUpDate?: Date
  deliveredAt?: Date
  deliveryAttachment?: DeliveryAttachment
  updatedAt?: Date

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
  }
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

  get pickedUpDate() {
    return this.props.pickedUpDate
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get deliveryAttachment() {
    return this.props.deliveryAttachment
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
