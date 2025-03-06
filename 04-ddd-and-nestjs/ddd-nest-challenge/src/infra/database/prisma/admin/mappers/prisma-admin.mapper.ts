import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Admin } from '@/domain/admin/entities/admin'
import { Prisma, Admin as PrismaAdmin } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        email: raw.email,
        userId: new UniqueEntityId(raw.userId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.AdminUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      email: admin.email,
      userId: admin.userId.toString(),
    }
  }
}
