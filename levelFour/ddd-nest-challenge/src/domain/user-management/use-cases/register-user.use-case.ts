import { Either, left, right } from '@/core/either'

import { User } from '../entities/user'
import { CPF } from '@/core/entities/value-objects/cpf'
import { InvalidCPFError } from '@/core/errors/invalid-cpf.error'
import { UserAlreadyExistError } from './errors/user-already-exists.error'
import { UsersRepository } from '../repositories/users.repository'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterUserUseCaseRequest {
  name: string
  cpf: string
  password: string
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
    })

    this.usersRepository.create(user)

    return right({ user })
  }
}
