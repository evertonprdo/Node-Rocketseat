import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AddressProps } from './address'
import { DeliveryAttachment } from '../delivery-attachment'

export interface DeliveryWithCustomerProps {
  customerId: UniqueEntityId
  customerName: string
  status: string
  customerAddress: AddressProps
  courierId?: UniqueEntityId | null
  createdAt: Date
  pickupDate?: Date | null
  deliveredAt?: Date | null
  deliveryAttachment?: DeliveryAttachment
  updatedAt?: Date | null
}

export class DeliveryWithCustomer extends ValueObject<DeliveryWithCustomerProps> {
  get customerId() {
    return this.props.customerId
  }

  get customerName() {
    return this.props.customerName
  }

  get customerAddress() {
    return this.props.customerAddress
  }

  get status() {
    return this.props.status
  }

  get courierId() {
    return this.props.courierId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get pickupDate() {
    return this.props.pickupDate
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

  static create(props: DeliveryWithCustomerProps) {
    return new DeliveryWithCustomer(props)
  }
}
