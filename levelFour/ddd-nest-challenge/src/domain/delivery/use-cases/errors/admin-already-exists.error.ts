import { UseCaseError } from '@/core/errors/use-case.error'

export class AdminAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`An admin with "${identifier}" cpf already exists`)
  }
}
