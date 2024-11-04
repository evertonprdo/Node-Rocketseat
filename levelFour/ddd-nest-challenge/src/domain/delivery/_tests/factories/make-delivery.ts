import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Delivery, DeliveryProps } from '../../entities/delivery'

export function makeDelivery(
  overwrite: Partial<DeliveryProps> = {},
  id?: UniqueEntityId,
) {
  const delivery = Delivery.create(
    {
      receiverId: new UniqueEntityId(),
      status: 'PENDING',
      createdAt: new Date(),
      ...overwrite,
    },
    id ?? new UniqueEntityId(),
  )

  return delivery
}
