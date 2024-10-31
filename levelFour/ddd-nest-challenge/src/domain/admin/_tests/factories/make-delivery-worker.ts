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
  const admin = DeliveryWorker.create(
    {
      userId: new UniqueEntityId(),
      operationZone: faker.location.city(),
      ...overwrite,
    },
    id,
  )

  return admin
}
