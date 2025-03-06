import { Either, left, right } from '@/core/either'

import { AdminDetails } from '../entities/values-objects/admin-details'
import { AdminsRepository } from '../repositories/admins.repository'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

interface GetAdminUseCaseRequest {
  adminId: string
}

type GetAdminUseCaseResponse = Either<
  ResourceNotFoundError,
  { admin: AdminDetails }
>

export class GetAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
  }: GetAdminUseCaseRequest): Promise<GetAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findDetailsById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    return right({ admin })
  }
}
