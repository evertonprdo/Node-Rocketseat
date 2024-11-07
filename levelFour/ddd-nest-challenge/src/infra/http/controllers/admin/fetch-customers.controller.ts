import { BadRequestException, Body, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { CustomerPresenter } from '../../presenters/admin/customer.presenter'
import { NestFetchCustomersUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-customers.use-case'

const fetchCustomersBodySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchCustomersBodySchema = z.infer<typeof fetchCustomersBodySchema>

const bodyValidationPipe = new ZodValidationPipe(fetchCustomersBodySchema)

@Controller('/customers')
@Roles(Role.ADMIN)
export class FetchCustomersController {
  constructor(private fetchCustomers: NestFetchCustomersUseCase) {}

  @Get()
  async handle(@Body(bodyValidationPipe) body: FetchCustomersBodySchema) {
    const { page } = body

    const result = await this.fetchCustomers.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { customers: result.value.customers.map(CustomerPresenter.toHTTP) }
  }
}
