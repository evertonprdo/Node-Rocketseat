import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/delivery/entities/admin'
import { CPF } from '@/domain/delivery/entities/value-objects/cpf'
import { Prisma, User as PrismaAdmin } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: CPF.createFromText(raw.cpf),
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf.value,
      password: admin.password,
      role: 'ADMIN',
    }
  }
}
