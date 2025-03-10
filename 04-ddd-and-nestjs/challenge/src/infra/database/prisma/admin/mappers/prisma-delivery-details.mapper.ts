import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { CEP } from '@/domain/_shared/entities/value-objects/cep'
import { Address } from '@/domain/_shared/entities/value-objects/address'

import { DeliveryDetails } from '@/domain/admin/entities/values-objects/delivery-details'

import {
  User as PrismaUser,
  Customer as PrismaCustomer,
  Delivery as PrismaDelivery,
  Attachment as PrismaAttachment,
  DeliveryWorker as PrismaDeliveryWorker,
} from '@prisma/client'
import { Attachment } from '@/domain/_shared/entities/attachment'

type PrismaDeliveryDetails = {
  customer: { user: PrismaUser } & PrismaCustomer
  deliveryWorker: ({ user: PrismaUser } & PrismaDeliveryWorker) | null
  attachment: PrismaAttachment | null
} & PrismaDelivery

export class PrismaDeliveryDetailsMapper {
  static toDomain(raw: PrismaDeliveryDetails): DeliveryDetails {
    const customerAddress = new Address({
      cep: CEP.createFromText(raw.customer.cep),
      city: raw.customer.city,
      neighborhood: raw.customer.neighborhood,
      number: raw.customer.number,
      state: raw.customer.state,
      street: raw.customer.street,
    })

    const deliveryWorker = raw.deliveryWorker
      ? {
          id: new UniqueEntityId(raw.deliveryWorker.id),
          name: raw.deliveryWorker.user.name,
          phone: raw.deliveryWorker.user.phone,
          cpf: CPF.createFromText(raw.deliveryWorker.user.cpf),
          operationZone: raw.deliveryWorker.operationZone,
        }
      : null

    const attachment = raw.attachment
      ? Attachment.create(
          {
            title: raw.attachment.title,
            url: raw.attachment.url,
          },
          new UniqueEntityId(raw.attachment.id),
        )
      : null

    return DeliveryDetails.create({
      deliveryId: new UniqueEntityId(raw.id),
      status: raw.status,
      customer: {
        id: new UniqueEntityId(raw.customer.id),
        name: raw.customer.user.name,
        email: raw.customer.email,
        address: customerAddress,
      },
      attachment,
      createdAt: raw.createdAt,
      deliveredAt: raw.deliveredAt,
      pickedUpAt: raw.pickedUpAt,
      updatedAt: raw.updatedAt,
      deliveryWorker,
    })
  }
}
