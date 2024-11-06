import { BadRequestException, Body, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { DeliveryPresenter } from '../../presenters/admin/delivery.presenter'
import { NestFetchDeliveriesUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-deliveries.use-case'

const fetchDeliveriesBodySchema = z.object({
  page: z.coerce.number().optional().default(1),
})

type FetchDeliveriesBodySchema = z.infer<typeof fetchDeliveriesBodySchema>

const bodyValidationPipe = new ZodValidationPipe(fetchDeliveriesBodySchema)

@Controller('/deliveries')
@Roles(Role.ADMIN)
export class FetchDeliveriesController {
  constructor(private fetchDeliveries: NestFetchDeliveriesUseCase) {}

  @Get()
  async handle(@Body(bodyValidationPipe) body: FetchDeliveriesBodySchema) {
    const { page } = body

    const result = await this.fetchDeliveries.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { deliveries: result.value.deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
