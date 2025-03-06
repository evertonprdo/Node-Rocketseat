import { Admin } from '../entities/admin'
import { AdminDetails } from '../entities/values-objects/admin-details'

export interface AdminsRepository {
  findById(id: string): Promise<Admin | null>
  findDetailsById(id: string): Promise<AdminDetails | null>
  findByEmail(email: string): Promise<Admin | null>
  findByUserId(userId: string): Promise<Admin | null>
  assign(admin: Admin): Promise<void>
  save(admin: Admin): Promise<void>
  unassign(admin: Admin): Promise<void>
}
