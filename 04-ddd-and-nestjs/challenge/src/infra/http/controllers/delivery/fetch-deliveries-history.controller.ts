import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeliveryPresenter } from '../../presenters/delivery/delivery.presenter'
import { NestFetchDeliveriesHistoryUseCase } from '@/infra/injectable-use-cases/delivery/nest-fetch-deliveries-history'

const fetchDeliveriesHistoryQuerySchema = z.object({
  page: z.coerce.number().default(1),
  status: z.enum(['PICKED_UP', 'DELIVERED', 'RETURNED']).optional(),
})

type FetchDeliveriesHistoryQuerySchema = z.infer<
  typeof fetchDeliveriesHistoryQuerySchema
>

const queryValidationPipe = new ZodValidationPipe(
  fetchDeliveriesHistoryQuerySchema,
)

@Controller('/app/deliveries/history')
@Roles(Role.DELIVERY_WORKER)
export class FetchDeliveriesHistoryController {
  constructor(
    private fetchDeliveredHistory: NestFetchDeliveriesHistoryUseCase,
  ) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchDeliveriesHistoryQuerySchema,
    @CurrentUser() deliveryWorker: UserPayload,
  ) {
    const { page, status } = query
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.fetchDeliveredHistory.execute({
      deliveryWorkerId,
      page,
      status,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { deliveries: result.value.deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
