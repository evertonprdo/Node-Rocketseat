import { UseCaseError } from '@/core/errors/use-case.error'

export class UserAlreadyAssignedError extends Error implements UseCaseError {
  constructor(identifier: 'ADMIN' | 'DELIVERY_WORKER' | 'CUSTOMER') {
    super(`User already assigned as "${identifier}"`)
  }
}
