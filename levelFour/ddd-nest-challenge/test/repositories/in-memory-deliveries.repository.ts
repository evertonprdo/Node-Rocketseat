import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { Delivery } from '@/domain/delivery/entities/delivery'
import { DeliveryWithCustomer } from '@/domain/delivery/entities/value-objects/delivery-with-customer'

import {
  DeliveriesRepository,
  FindManyByCourierIdProps,
} from '@/domain/delivery/repositories/deliveries.repository'

import { InMemoryCustomersRepository } from './in-memory-customers.repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  constructor(private customerRepository: InMemoryCustomersRepository) {}

  async findMany({ page }: PaginationParams) {
    const take = 20

    const deliveries = this.items.slice((page - 1) * take, page * take)

    return deliveries
  }

  async findManyPendingByCity(city: string) {
    const deliveriesByCity = this.items.filter((item) => {
      const customer = this.customerRepository.items.find(
        (customer) =>
          customer.id.equals(item.customerId) && customer.address.city === city,
      )
      return customer !== undefined && item.status === 'PENDING'
    })

    return deliveriesByCity
  }

  async findManyByCourierId({ courierId, page }: FindManyByCourierIdProps) {
    const take = 20

    const deliveries = this.items
      .filter((item) => item.courierId?.toString() === courierId)
      .slice((page - 1) * take, page * take)

    return deliveries
  }

  async findByIdWithCustomer(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    const customer = await this.customerRepository.findById(
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

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async save(delivery: Delivery) {
    const deliveryIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items[deliveryIndex] = delivery

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async delete(delivery: Delivery) {
    const deliveryIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    this.items.splice(deliveryIndex, 1)
  }
}
