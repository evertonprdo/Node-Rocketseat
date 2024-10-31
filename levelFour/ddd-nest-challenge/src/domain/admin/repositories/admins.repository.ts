import { Admin } from '../entities/admin'

export interface AdminsRepository {
  assign(admin: Admin): Promise<void>
  findByEmail(email: string): Promise<Admin | null>
}
