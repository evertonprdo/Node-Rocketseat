import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { UsersRepository } from '../repositories/users.repository'
import { AdminsRepository } from '../repositories/admins.repository'

import { EmailAlreadyInUseError } from './errors/email-already-in-use.error'

import { Admin } from '../entities/admin'

interface AssignAdminUseCaseRequest {
  userId: string
  email: string
}

type AssignAdminUseCaseResponse = Either<
  ResourceNotFoundError | EmailAlreadyInUseError,
  {
    admin: Admin
  }
>

export class AssignAdminUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    userId,
    email,
  }: AssignAdminUseCaseRequest): Promise<AssignAdminUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)

    if (adminWithSameEmail) {
      return left(new EmailAlreadyInUseError(email))
    }

    const admin = Admin.create({
      userId: user.id,
      email,
    })

    await this.adminsRepository.assign(admin)

    return right({ admin })
  }
}
