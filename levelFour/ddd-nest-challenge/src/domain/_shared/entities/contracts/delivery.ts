import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryAttachment } from '../delivery-attachment'

export type StatusKeys = 'PENDING' | 'PICKED_UP' | 'DELIVERED' | 'RETURNED'

export interface DeliveryProps {
  customerId: UniqueEntityId
  status: StatusKeys
  deliveryWorkerId?: UniqueEntityId
  createdAt: Date
  pickedUpDate?: Date
  deliveredAt?: Date
  deliveryAttachment?: DeliveryAttachment
  updatedAt?: Date
}
