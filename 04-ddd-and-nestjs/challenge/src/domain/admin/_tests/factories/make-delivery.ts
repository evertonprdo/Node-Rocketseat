import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Delivery, DeliveryProps } from '../../entities/delivery'

export function makeDelivery(
  overwrite: Partial<DeliveryProps> = {},
  id?: UniqueEntityId,
) {
  const delivery = Delivery.create(
    {
      customerId: new UniqueEntityId(),
      ...overwrite,
    },
    id,
  )
  return delivery
}
