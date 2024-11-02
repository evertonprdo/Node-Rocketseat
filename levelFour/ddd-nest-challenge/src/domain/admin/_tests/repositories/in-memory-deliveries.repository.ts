import { InMemoryCustomersRepository } from './in-memory-customers.repository'
import { InMemoryDeliveryWorkersRepository } from './in-memory-delivery-workers.repository'

import {
  DeliveryDetails,
  DeliveryDetailsProps,
} from '../../entities/values-objects/delivery-details'

import { Delivery } from '../../entities/delivery'
import { DeliveriesRepository } from '../../repositories/deliveries.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(
    public customersRepository: InMemoryCustomersRepository,
    public deliveryWorkersRepository: InMemoryDeliveryWorkersRepository,
  ) {}

  async findDetailsById(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    const customer = await this.customersRepository.findById(
      delivery.customerId.toString(),
    )

    if (!customer) {
      throw new Error()
    }

    const deliveryDetailsProps: DeliveryDetailsProps = {
      deliveryId: delivery.id,
      status: delivery.status,
      createdAt: delivery.createdAt,
      pickedUpDate: delivery.pickedUpDate,
      deliveredAt: delivery.deliveredAt,
      deliveryAttachment: delivery.deliveryAttachment,
      updatedAt: delivery.updatedAt,

      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
      },
    }

    if (delivery.deliveryWorkerId) {
      const deliveryWorker =
        await this.deliveryWorkersRepository.findDetailsById(
          delivery.deliveryWorkerId.toString(),
        )

      if (!deliveryWorker) {
        throw new Error()
      }

      deliveryDetailsProps.deliveryWorker = {
        id: deliveryWorker.deliveryWorkerId,
        name: deliveryWorker.name,
        phone: deliveryWorker.phone,
        cpf: deliveryWorker.cpf,
        operationZone: deliveryWorker.operationZone,
      }
    }

    return DeliveryDetails.create(deliveryDetailsProps)
  }

  async create(delivery: Delivery) {
    this.items.push(delivery)
  }
}
