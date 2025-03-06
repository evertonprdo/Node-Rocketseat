import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface DeliveryWorkerProps {
  userId: UniqueEntityId
  operationZone: string
}

export class DeliveryWorker extends Entity<DeliveryWorkerProps> {
  get userId() {
    return this.props.userId
  }

  get operationZone() {
    return this.props.operationZone
  }

  set operationZone(operationZone: string) {
    this.props.operationZone = operationZone
  }

  static create(props: DeliveryWorkerProps, id?: UniqueEntityId) {
    const deliveryWorker = new DeliveryWorker(props, id)

    return deliveryWorker
  }
}
