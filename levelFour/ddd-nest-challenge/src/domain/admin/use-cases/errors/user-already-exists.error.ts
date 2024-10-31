import { UseCaseError } from '@/domain/_shared/errors/use-case.error'

export class UserAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`A User with "${identifier}" cpf already exists`)
  }
}
