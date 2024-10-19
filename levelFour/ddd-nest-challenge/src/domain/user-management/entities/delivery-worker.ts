import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from './user'

interface DeliveryWorkerProps extends UserProps {
  operationZone: string
}

export class DeliveryWorker extends User<DeliveryWorkerProps> {
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
