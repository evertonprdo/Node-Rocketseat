import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { CustomerPresenter } from '../../presenters/admin/customer.presenter'
import { NestGetCustomerUseCase } from '@/infra/injectable-use-cases/admin/nest-get-customer.use-case'

@Controller('/customers/:id')
@Roles(Role.ADMIN)
export class GetCustomerController {
  constructor(private getCustomer: NestGetCustomerUseCase) {}

  @Get()
  async handle(@Param('id') customerId: string) {
    const result = await this.getCustomer.execute({
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

    return { customer: CustomerPresenter.toHTTP(result.value.customer) }
  }
}
