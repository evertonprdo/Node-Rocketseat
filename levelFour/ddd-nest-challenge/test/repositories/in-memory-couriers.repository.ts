import { PaginationParams } from '@/domain/_shared/repositories/pagination-params'
import { Courier } from '@/domain/delivery/entities/courier'
import { CouriersRepository } from '@/domain/delivery/repositories/couriers.repository'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async findMany({ page }: PaginationParams) {
    const take = 20

    const couriers = this.items.slice((page - 1) * take, page * take)

    return couriers
  }

  async findById(id: string) {
    const courier = this.items.find((item) => item.id.toString() === id)

    if (!courier) {
      return null
    }

    return courier
  }

  async findByCPF(cpf: string) {
    const courier = this.items.find((item) => item.cpf.value === cpf)

    if (!courier) {
      return null
    }

    return courier
  }

  async create(courier: Courier) {
    this.items.push(courier)
  }

  async save(courier: Courier) {
    const courierIndex = this.items.findIndex((item) =>
      item.id.equals(courier.id),
    )

    this.items[courierIndex] = courier
  }

  async delete(courier: Courier) {
    const courierIndex = this.items.findIndex((item) =>
      item.id.equals(courier.id),
    )

    this.items.splice(courierIndex, 1)
  }
}
