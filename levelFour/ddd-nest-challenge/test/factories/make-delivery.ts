import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Delivery, DeliveryProps } from '@/domain/delivery/entities/delivery'

export function makeDelivery(
  overwrite: Partial<DeliveryProps> = {},
  id?: UniqueEntityId,
) {
  const delivery = Delivery.create(
    {
      customerId: new UniqueEntityId(),
      status: faker.helpers.arrayElement([
        'PENDING',
        'PICKED_UP',
        'DELIVERED',
        'RETURNED',
      ]),
      ...overwrite,
    },
    id,
  )

  return delivery
}
