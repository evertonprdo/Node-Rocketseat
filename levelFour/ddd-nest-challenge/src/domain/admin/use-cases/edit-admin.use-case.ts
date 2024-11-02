import { Either, left, right } from '@/core/either'

import { Admin } from '../entities/admin'
import { AdminsRepository } from '../repositories/admins.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface EditAdminUseCaseRequest {
  adminId: string
  email: string
}

type EditAdminUseCaseResponse = Either<ResourceNotFoundError, { admin: Admin }>

export class EditAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
    email,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    admin.email = email

    await this.adminsRepository.save(admin)

    return right({ admin })
  }
}
