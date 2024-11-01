import { Either, left, right } from '@/core/either'

import { UsersRepository } from '../repositories/users.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    await this.usersRepository.delete(user)

    return right(null)
  }
}
