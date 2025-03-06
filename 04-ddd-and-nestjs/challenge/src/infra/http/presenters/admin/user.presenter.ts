import { User } from '@/domain/admin/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      cpf: user.cpf.toDecorated(),
      name: user.name,
      phone: user.phone,
    }
  }
}
