import { BadRequestException, Body, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { NestFetchDeliveryWorkersUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-delivery-workers.use-case'
import { DeliveryWorkerDetailsPresenter } from '../../presenters/admin/delivery-worker-details.presenter'

const fetchDeliveryWorkersBodySchema = z.object({
  page: z.coerce.number().optional().default(1),
})

type FetchDeliveryWorkersBodySchema = z.infer<
  typeof fetchDeliveryWorkersBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(fetchDeliveryWorkersBodySchema)

@Controller('/delivery-workers')
@Roles(Role.ADMIN)
export class FetchDeliveryWorkersController {
  constructor(private fetchDeliveryWorkers: NestFetchDeliveryWorkersUseCase) {}

  @Get()
  async handle(@Body(bodyValidationPipe) body: FetchDeliveryWorkersBodySchema) {
    const { page } = body

    const result = await this.fetchDeliveryWorkers.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      delivery_workers: result.value.deliveryWorkers.map(
        DeliveryWorkerDetailsPresenter.toHTTP,
      ),
    }
  }
}
