import { Either, left, right } from '@/core/either'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { User } from '../entities/user'

import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users.repository'

interface EditUserUseCaseRequest {
  userId: string
  name: string
  phone: string
  password: string
}

type EditUserUseCaseResponse = Either<ResourceNotFoundError, { user: User }>

export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    password,
    phone,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    user.name = name
    user.password = await this.hashGenerator.hash(password)
    user.phone = phone

    await this.usersRepository.save(user)

    return right({ user })
  }
}
