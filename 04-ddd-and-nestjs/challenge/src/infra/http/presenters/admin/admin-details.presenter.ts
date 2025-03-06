import { AdminDetails } from '@/domain/admin/entities/values-objects/admin-details'

export class AdminDetailsPresenter {
  static toHTTP(admin: AdminDetails) {
    return {
      adminId: admin.adminId.toString(),
      userId: admin.userId.toString(),
      cpf: admin.cpf.toDecorated(),
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
    }
  }
}
