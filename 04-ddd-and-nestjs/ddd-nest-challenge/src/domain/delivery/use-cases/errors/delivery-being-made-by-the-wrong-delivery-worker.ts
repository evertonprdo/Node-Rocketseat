import { UseCaseError } from '@/core/errors/use-case.error'

export class DeliveryBeingMadeByWrongDeliveryWorkerError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Only the delivery worker who picked up the delivery can update it.`)
  }
}
