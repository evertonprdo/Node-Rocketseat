import { PaginationParams } from '@/core/repositories/pagination-params'

import { Delivery } from '@/domain/delivery/entities/delivery'
import { DeliveryWithCustomer } from '@/domain/delivery/entities/value-objects/delivery-with-customer'

import { DeliveriesRepository } from '@/domain/delivery/repositories/deliveries.repository'
import { InMemoryCustomersRepository } from './in-memory-customers.repository'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(private customerDetails: InMemoryCustomersRepository) {}

  async findMany({ page }: PaginationParams) {
    const take = 20

    const deliveries = this.items.slice((page - 1) * take, page * take)

    return deliveries
  }

  async findByIdWithCustomer(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    const customer = await this.customerDetails.findById(
      delivery.customerId.toString(),
    )

    if (!customer) {
      throw new Error(
        `Customer with Id "${delivery.customerId.toString()}" does not exist`,
      )
    }

    return DeliveryWithCustomer.create({
      customerId: delivery.customerId,
      customerName: customer.name,
      customerAddress: customer.address,
      status: delivery.status,
      courierId: delivery.courierId,
      createdAt: delivery.createdAt,
      pickupDate: delivery.pickedUpDate,
      deliveredAt: delivery.deliveredAt,
      deliveryAttachment: delivery.deliveryAttachment,
      updatedAt: delivery.updatedAt,
    })
  }

  async findById(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async create(delivery: Delivery) {
    this.items.push(delivery)
  }

  async save(delivery: Delivery) {
    const deliveryIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items[deliveryIndex] = delivery
  }

  async delete(delivery: Delivery) {
    const deliveryIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items.splice(deliveryIndex, 1)
  }
}
