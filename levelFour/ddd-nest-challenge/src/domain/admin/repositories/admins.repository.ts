import { Admin } from '../entities/admin'

export interface AdminsRepository {
  findByCPF(cpf: string): Promise<Admin | null>
  create(admin: Admin): Promise<void>
}
