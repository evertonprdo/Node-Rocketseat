import { UseCaseError } from '@/core/errors/use-case.error'

export class DeliveryWrongStatusError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Invalid operation to delivery with "${identifier}" status`)
  }
}
