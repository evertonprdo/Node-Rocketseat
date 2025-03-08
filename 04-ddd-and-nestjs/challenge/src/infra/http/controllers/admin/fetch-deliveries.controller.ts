import { BadRequestException, Query, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { DeliveryPresenter } from '../../presenters/admin/delivery.presenter'
import { NestFetchDeliveriesUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-deliveries.use-case'

const fetchDeliveriesQuerySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchDeliveriesQuerySchema = z.infer<typeof fetchDeliveriesQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchDeliveriesQuerySchema)

@Controller('/deliveries')
@Roles(Role.ADMIN)
export class FetchDeliveriesController {
  constructor(private fetchDeliveries: NestFetchDeliveriesUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchDeliveriesQuerySchema) {
    const { page } = query

    const result = await this.fetchDeliveries.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { deliveries: result.value.deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
