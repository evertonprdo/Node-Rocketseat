import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

import { Admin } from '../entities/admin'

import { UsersRepository } from '../repositories/users.repository'
import { AdminsRepository } from '../repositories/admins.repository'

interface AssignAdminUseCaseRequest {
  userId: string
  operationZone: string
}

type AssignAdminUseCaseResponse = Either<ResourceNotFoundError, null>

export class AssignAdminUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    userId,
  }: AssignAdminUseCaseRequest): Promise<AssignAdminUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const admin = Admin.create({
      name: user.name,
      cpf: user.cpf,
      password: user.password,
    })

    await this.adminsRepository.assign(admin)

    return right(null)
  }
}
