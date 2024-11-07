import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import {
  Customer as PrismaCustomer,
  Delivery as PrismaDelivery,
  Attachment as PrismaAttachment,
} from '@prisma/client'

import { DeliveryDetails } from '@/domain/delivery/entities/value-objects/delivery-details'

type PrismaDeliveryDetails = {
  customer: PrismaCustomer
  attachment: PrismaAttachment | null
} & PrismaDelivery

export class PrismaDeliveryDetailsMapper {
  static toDomain(raw: PrismaDeliveryDetails): DeliveryDetails {
    const address = new Address({
      cep: CEP.createFromText(raw.customer.cep),
      state: raw.customer.state,
      city: raw.customer.city,
      street: raw.customer.street,
      number: raw.customer.number,
      neighborhood: raw.customer.neighborhood,
    })

    return DeliveryDetails.create({
      deliveryId: new UniqueEntityId(raw.id),
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      pickedUpAt: raw.pickedUpAt,
      deliveredAt: raw.deliveredAt,

      receiver: {
        id: new UniqueEntityId(raw.customer.id),
        name: raw.customer.name,
        address,
      },
    })
  }
}
