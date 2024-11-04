import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Receiver, ReceiverProps } from '../../entities/receiver'
import { makeAddress } from '@/domain/_shared/_tests/factories/make-address'

export function makeReceiver(
  overwrite: Partial<ReceiverProps> = {},
  id?: UniqueEntityId,
) {
  const receiver = Receiver.create(
    {
      name: faker.person.fullName(),
      address: makeAddress(),
      ...overwrite,
    },
    id,
  )

  return receiver
}
