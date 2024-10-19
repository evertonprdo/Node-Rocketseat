import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Entity } from '@/core/entities/entity'

export interface AdminProps {
  name: string
}

export class Admin extends Entity<AdminProps> {
  static create(props: AdminProps, id?: UniqueEntityId) {
    const student = new Admin(props, id)

    return student
  }
}
