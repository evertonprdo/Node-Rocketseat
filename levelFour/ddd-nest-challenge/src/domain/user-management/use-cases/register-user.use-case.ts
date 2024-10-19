import { Either, left, right } from '@/core/either'

import { User } from '../entities/user'
import { CPF } from '@/core/entities/value-objects/cpf'

import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users.repository'

import { UserAlreadyExistError } from './errors/user-already-exists.error'
import { InvalidCPFError } from './errors/invalid-cpf.error'

interface RegisterUserUseCaseRequest {
  name: string
  cpf: string
  password: string
  role: 'ADMIN' | 'COURIER'
}

type RegisterUserUseCaseResponse = Either<
  InvalidCPFError | UserAlreadyExistError,
  { user: User }
>

export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    if (!CPF.isValidCPF(cpf)) {
      return left(new InvalidCPFError(cpf))
    }

    const userCPF = CPF.createFromText(cpf)
    const userWithSameCpf = await this.usersRepository.findByCPF(userCPF.value)

    if (userWithSameCpf) {
      return left(new UserAlreadyExistError(cpf))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      cpf: userCPF,
      password: passwordHash,
      role,
    })

    this.usersRepository.create(user)

    return right({ user })
  }
}
