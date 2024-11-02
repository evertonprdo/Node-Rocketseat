import { InMemoryUsersRepository } from './in-memory-users.repository'

import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'

import { DeliveryWorker } from '../../entities/delivery-worker'
import { DeliveryWorkerDetails } from '../../entities/values-objects/delivery-worker-details'
import { DeliveryWorkersRepository } from '../../repositories/delivery-workers.repository'

export class InMemoryDeliveryWorkersRepository
  implements DeliveryWorkersRepository
{
  public items: DeliveryWorker[] = []

  constructor(public usersRepository: InMemoryUsersRepository) {}

  async findById(id: string) {
    const deliveryWorker = this.items.find((item) => item.id.toString() === id)

    if (!deliveryWorker) {
      return null
    }

    return deliveryWorker
  }

  async findDetailsById(id: string) {
    const deliveryWorker = this.items.find((item) => item.id.toString() === id)

    if (!deliveryWorker) {
      return null
    }

    const user = await this.usersRepository.findById(
      deliveryWorker.userId.toString(),
    )

    if (!user) {
      throw new Error()
    }

    return DeliveryWorkerDetails.create({
      userId: user.id,
      deliveryWorkerId: deliveryWorker.id,
      name: user.name,
      phone: user.phone,
      cpf: user.cpf,
      operationZone: deliveryWorker.operationZone,
    })
  }

  async findManyDetails({ page }: PaginationParams) {
    const deliveryWorkers: DeliveryWorkerDetails[] = []

    for (const item of this.items) {
      const user = await this.usersRepository.findById(item.userId.toString())

      if (!user) {
        throw new Error()
      }

      deliveryWorkers.push(
        DeliveryWorkerDetails.create({
          userId: user.id,
          deliveryWorkerId: item.id,
          name: user.name,
          phone: user.phone,
          cpf: user.cpf,
          operationZone: item.operationZone,
        }),
      )
    }

    const take = 20
    return deliveryWorkers.slice((page - 1) * take, page * take)
  }

  async assign(deliveryWorker: DeliveryWorker) {
    this.items.push(deliveryWorker)
  }

  async save(deliveryWorker: DeliveryWorker) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryWorker.id,
    )

    this.items[itemIndex] = deliveryWorker
  }

  async unassign(deliveryWorker: DeliveryWorker) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryWorker.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
