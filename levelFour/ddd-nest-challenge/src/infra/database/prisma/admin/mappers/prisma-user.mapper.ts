import { User } from '@/domain/admin/entities/user'
import { Prisma } from '@prisma/client'

export class PrismaUserMapper {
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
