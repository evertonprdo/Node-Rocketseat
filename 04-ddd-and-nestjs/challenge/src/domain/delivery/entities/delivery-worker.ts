import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface DeliveryWorkerProps {
  name: string
  operationCity: string
}

export class DeliveryWorker extends Entity<DeliveryWorkerProps> {
  get name() {
    return this.props.operationCity
  }

  get operationCity() {
    return this.props.operationCity
  }

  static create(props: DeliveryWorkerProps, id?: UniqueEntityId) {
    const deliveryWorker = new DeliveryWorker(props, id)

    return deliveryWorker
  }
}
