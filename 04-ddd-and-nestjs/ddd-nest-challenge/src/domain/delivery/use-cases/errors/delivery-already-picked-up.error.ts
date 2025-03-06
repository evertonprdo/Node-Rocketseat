import { UseCaseError } from '@/core/errors/use-case.error'

export class DeliveryAlreadyPickedUpError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`The delivery "${identifier}" already picked up`)
  }
}
