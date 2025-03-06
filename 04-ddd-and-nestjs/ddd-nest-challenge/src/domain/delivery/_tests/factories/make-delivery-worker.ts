import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import {
  DeliveryWorker,
  DeliveryWorkerProps,
} from '../../entities/delivery-worker'

export function makeDeliveryWorker(
  overwrite: Partial<DeliveryWorkerProps> = {},
  id?: UniqueEntityId,
) {
  const deliveryWorker = DeliveryWorker.create(
    {
      name: faker.person.fullName(),
      operationCity: faker.location.city(),
      ...overwrite,
    },
    id,
  )

  return deliveryWorker
}
