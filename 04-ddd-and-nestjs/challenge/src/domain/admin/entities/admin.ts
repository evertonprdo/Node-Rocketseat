import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface AdminProps {
  userId: UniqueEntityId
  email: string
}

export class Admin extends Entity<AdminProps> {
  get email() {
    return this.props.email
  }

  get userId() {
    return this.props.userId
  }

  set email(email: string) {
    this.props.email = email
  }

  static create(props: AdminProps, id?: UniqueEntityId) {
    const admin = new Admin(props, id)

    return admin
  }
}
