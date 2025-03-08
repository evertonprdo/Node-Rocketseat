import {
  BadRequestException,
  Query,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { DeliveryPresenter } from '../../presenters/delivery/delivery.presenter'
import { NestFetchPendingDeliveriesNearbyUseCase } from '@/infra/injectable-use-cases/delivery/nest-fetch-pending-deliveries-nearby.use-case'

const fetchPendingDeliveriesNearbyQuerySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchPendingDeliveriesNearbyQuerySchema = z.infer<
  typeof fetchPendingDeliveriesNearbyQuerySchema
>

const queryValidationPipe = new ZodValidationPipe(
  fetchPendingDeliveriesNearbyQuerySchema,
)

@Controller('/app/deliveries/nearby')
@Roles(Role.DELIVERY_WORKER)
export class FetchPendingDeliveriesNearbyController {
  constructor(
    private fetchPendingDeliveriesNearby: NestFetchPendingDeliveriesNearbyUseCase,
  ) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) query: FetchPendingDeliveriesNearbyQuerySchema,
    @CurrentUser() deliveryWorker: UserPayload,
  ) {
    const { page } = query
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.fetchPendingDeliveriesNearby.execute({
      deliveryWorkerId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException()
      }
    }

    return { deliveries: result.value.deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
