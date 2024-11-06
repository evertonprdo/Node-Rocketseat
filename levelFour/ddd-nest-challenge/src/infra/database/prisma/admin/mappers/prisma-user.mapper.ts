import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CPF } from '@/domain/_shared/entities/value-objects/cpf'
import { User } from '@/domain/admin/entities/user'

import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        cpf: CPF.createFromText(raw.cpf),
        password: raw.password,
        phone: raw.phone,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      cpf: user.cpf.value,
      name: user.name,
      password: user.password,
      phone: user.phone,
    }
  }
}
