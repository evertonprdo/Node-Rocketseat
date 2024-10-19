import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps } from './user'

interface AdminProps extends UserProps {}

export class Admin extends User<AdminProps> {
  static create(props: AdminProps, id?: UniqueEntityId) {
    const admin = new Admin(props, id)

    return admin
  }
}
