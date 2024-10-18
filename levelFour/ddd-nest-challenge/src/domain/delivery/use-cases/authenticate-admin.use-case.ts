import { Either, left, right } from '@/core/either'

import { CPF } from '@/domain/delivery/entities/value-objects/cpf'

import { HashGenerator } from '../cryptography/hash-generator'
import { Encrypter } from '../cryptography/encrypter'
import { AdminsRepository } from '../repositories/admins.repository'

import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashCompare: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    if (!CPF.isValidCPF(cpf)) {
      return left(new WrongCredentialsError())
    }

    const adminCPF = CPF.createFromText(cpf)
    const admin = await this.adminsRepository.findByCPF(adminCPF.value)

    if (!admin) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      admin.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
