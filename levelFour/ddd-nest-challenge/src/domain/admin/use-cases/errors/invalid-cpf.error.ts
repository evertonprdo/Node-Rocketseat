import { UseCaseError } from '@/core/errors/use-case.error'

export class InvalidCPFError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`CPF: "${identifier}" is not valid`)
  }
}
