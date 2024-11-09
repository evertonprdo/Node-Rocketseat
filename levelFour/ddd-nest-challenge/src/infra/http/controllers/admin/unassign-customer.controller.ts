import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NestUnassignCustomerUseCase } from '@/infra/injectable-use-cases/admin/nest-delete-customer.use-case'

@Controller('/customers/:id')
@Roles(Role.ADMIN)
export class UnassignCustomerController {
  constructor(private deleteCustomer: NestUnassignCustomerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') customerId: string) {
    const result = await this.deleteCustomer.execute({
      customerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
