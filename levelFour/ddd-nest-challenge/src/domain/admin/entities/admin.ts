import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Employee, EmployeeProps } from './employee'

interface AdminProps extends EmployeeProps {}

export class Admin extends Employee<AdminProps> {
  static create(props: AdminProps, id?: UniqueEntityId) {
    const student = new Admin(props, id)

    return student
  }
}
