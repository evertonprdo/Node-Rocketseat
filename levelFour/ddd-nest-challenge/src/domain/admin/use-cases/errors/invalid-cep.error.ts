import { UseCaseError } from '@/core/errors/use-case.error'

export class InvalidCEPError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`CEP: "${identifier}" is not valid`)
  }
}
