import { Either, left, right } from '@/core/either'

import { Admin } from '../entities/admin'
import { CPF } from '@/domain/delivery/entities/value-objects/cpf'

import { HashCompare } from '../cryptography/hash-compare'
import { AdminsRepository } from '../repositories/admins.repository'

import { InvalidCPFError } from './errors/invalid-cpf.error'
import { AdminAlreadyExistError } from './errors/admin-already-exists.error'

interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  InvalidCPFError | AdminAlreadyExistError,
  { admin: Admin }
>

export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashCompare,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    if (!CPF.isValidCPF(cpf)) {
      return left(new InvalidCPFError(cpf))
    }

    const adminCPF = CPF.createFromText(cpf)
    const adminWithSameCpf = await this.adminsRepository.findByCPF(
      adminCPF.value,
    )

    if (adminWithSameCpf) {
      return left(new AdminAlreadyExistError(cpf))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf: adminCPF,
      password: passwordHash,
    })

    this.adminsRepository.create(admin)

    return right({ admin })
  }
}
