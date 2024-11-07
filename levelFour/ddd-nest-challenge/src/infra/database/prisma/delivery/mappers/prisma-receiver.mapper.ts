import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'
import { Receiver } from '@/domain/delivery/entities/receiver'

import { Customer as PrismaReceiver } from '@prisma/client'

export class PrismaReceiverMapper {
  static toDomain(raw: PrismaReceiver): Receiver {
    const address = new Address({
      cep: CEP.createFromText(raw.cep),
      state: raw.state,
      city: raw.city,
      street: raw.street,
      number: raw.number,
      neighborhood: raw.neighborhood,
    })

    return Receiver.create(
      {
        name: raw.name,
        address,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
