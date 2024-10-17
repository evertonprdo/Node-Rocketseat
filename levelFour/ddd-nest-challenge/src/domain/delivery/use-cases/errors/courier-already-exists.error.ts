import { UseCaseError } from '@/core/errors/use-case.error'

export class CourierAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`A Courier with "${identifier}" cpf already exists`)
  }
}
