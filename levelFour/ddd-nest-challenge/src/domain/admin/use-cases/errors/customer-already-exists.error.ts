import { UseCaseError } from '@/core/errors/use-case.error'

export class CustomerAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`A Customer with "${identifier}" email already exists`)
  }
}
