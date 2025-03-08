import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { CustomerPresenter } from '../../presenters/admin/customer.presenter'
import { NestFetchCustomersUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-customers.use-case'

const fetchCustomersQuerySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchCustomersQuerySchema = z.infer<typeof fetchCustomersQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchCustomersQuerySchema)

@Controller('/customers')
@Roles(Role.ADMIN)
export class FetchCustomersController {
  constructor(private fetchCustomers: NestFetchCustomersUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchCustomersQuerySchema) {
    const { page } = query

    const result = await this.fetchCustomers.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      customers: result.value.customers.map(CustomerPresenter.toHTTP),
    }
  }
}
