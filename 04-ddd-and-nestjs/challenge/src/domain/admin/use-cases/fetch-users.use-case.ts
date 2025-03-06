import { Either, right } from '@/core/either'

import { User } from '../entities/user'
import { UsersRepository } from '../repositories/users.repository'

interface FetchUsersUseCaseRequest {
  page: number
}

type FetchUsersUseCaseResponse = Either<null, { users: User[] }>

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const users = await this.usersRepository.findMany({ page })

    return right({ users })
  }
}
