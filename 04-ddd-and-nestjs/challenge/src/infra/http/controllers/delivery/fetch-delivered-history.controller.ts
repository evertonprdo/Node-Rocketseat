import { BadRequestException, Body, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeliveryPresenter } from '../../presenters/delivery/delivery.presenter'
import { NestFetchDeliveredHistoryUseCase } from '@/infra/injectable-use-cases/delivery/nest-fetch-delivered-history'

const fetchDeliveredHistoryBodySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchDeliveredHistoryBodySchema = z.infer<
  typeof fetchDeliveredHistoryBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  fetchDeliveredHistoryBodySchema,
)

@Controller('/app/deliveries/delivered-history')
@Roles(Role.DELIVERY_WORKER)
export class FetchDeliveredHistoryController {
  constructor(
    private fetchDeliveredHistory: NestFetchDeliveredHistoryUseCase,
  ) {}

  @Get()
  async handle(
    @Body(bodyValidationPipe) body: FetchDeliveredHistoryBodySchema,
    @CurrentUser() deliveryWorker: UserPayload,
  ) {
    const { page } = body
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.fetchDeliveredHistory.execute({
      deliveryWorkerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { deliveries: result.value.deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
