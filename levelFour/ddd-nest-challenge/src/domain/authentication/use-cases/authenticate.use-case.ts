import { Either, left, right } from '@/core/either'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'

import { UsersRepository } from '../repositories/users.repository'

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
    private usersRepository: UsersRepository,
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
    const user = await this.usersRepository.findByCPF(entityCPF.value)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      adminId: user.adminId ? user.adminId.toString() : null,
      deliveryWorkerId: user.deliveryWorkerId
        ? user.deliveryWorkerId.toString()
        : null,
    })

    return right({
      accessToken,
    })
  }
}
