import { Either, left, right } from '@/core/either'

import { Courier } from '../entities/courier'
import { CPF } from '@/domain/delivery/entities/value-objects/cpf'

import { CouriersRepository } from '../repositories/couriers.repository'
import { HashGenerator } from '../cryptography/hash-compare'

import { InvalidCPFError } from './errors/invalid-cpf.error'
import { CourierAlreadyExistError } from './errors/courier-already-exists.error'

interface RegisterCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterCourierUseCaseResponse = Either<
  InvalidCPFError | CourierAlreadyExistError,
  { courier: Courier }
>

export class RegisterCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    if (!CPF.isValidCPF(cpf)) {
      return left(new InvalidCPFError(cpf))
    }

    const courierCPF = CPF.createFromText(cpf)
    const courierWithSameCPF = await this.couriersRepository.findByCPF(
      courierCPF.value,
    )

    if (courierWithSameCPF) {
      return left(new CourierAlreadyExistError(cpf))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const courier = Courier.create({
      name,
      cpf: courierCPF,
      password: passwordHash,
    })

    await this.couriersRepository.create(courier)

    return right({
      courier,
    })
  }
}
