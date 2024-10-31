import { UseCaseError } from '@/domain/_shared/errors/use-case.error'

export class EmailAlreadyInUseError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`email: "${identifier}" already in use`)
  }
}
