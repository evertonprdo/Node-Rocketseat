import { Either, left, right } from '@/core/either'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

import { AccountsRepository } from '../repositories/accounts.repository'

import { HashCompare } from '../cryptography/hash-compare'
import { Encrypter } from '../cryptography/encrypter'

import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    if (!CPF.isValidCPF(cpf)) {
      return left(new WrongCredentialsError())
    }

    const entityCPF = CPF.createFromText(cpf)
    const account = await this.accountsRepository.findByCPF(entityCPF.value)

    if (!account) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      account.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: account.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
