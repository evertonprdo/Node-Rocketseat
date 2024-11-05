import { Admin as PrismaAdmin, User as PrismaUser } from '@prisma/client'
import { AdminDetails } from '@/domain/admin/entities/values-objects/admin-details'
import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

type PrismaAdminWithUser = {
  user: PrismaUser
} & PrismaAdmin

export class PrismaAdminDetailsMapper {
  static toDomain(raw: PrismaAdminWithUser): AdminDetails {
    return AdminDetails.create({
      adminId: new UniqueEntityId(raw.id),
      userId: new UniqueEntityId(raw.user.id),
      cpf: CPF.createFromText(raw.user.cpf),
      email: raw.email,
      name: raw.user.name,
      phone: raw.user.phone,
    })
  }
}
