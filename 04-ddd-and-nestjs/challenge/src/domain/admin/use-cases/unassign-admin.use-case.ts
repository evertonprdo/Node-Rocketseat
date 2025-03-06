import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { AdminsRepository } from '../repositories/admins.repository'

interface UnassignAdminUseCaseRequest {
  adminId: string
}

type UnassignAdminUseCaseResponse = Either<ResourceNotFoundError, null>

export class UnassignAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
  }: UnassignAdminUseCaseRequest): Promise<UnassignAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    await this.adminsRepository.unassign(admin)

    return right(null)
  }
}
