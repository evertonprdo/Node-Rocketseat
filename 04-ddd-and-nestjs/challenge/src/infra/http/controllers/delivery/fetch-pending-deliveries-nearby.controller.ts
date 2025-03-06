import {
  BadRequestException,
  Body,
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

const fetchPendingDeliveriesNearbyBodySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchPendingDeliveriesNearbyBodySchema = z.infer<
  typeof fetchPendingDeliveriesNearbyBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  fetchPendingDeliveriesNearbyBodySchema,
)

@Controller('/app/deliveries/nearby')
@Roles(Role.DELIVERY_WORKER)
export class FetchPendingDeliveriesNearbyController {
  constructor(
    private fetchPendingDeliveriesNearby: NestFetchPendingDeliveriesNearbyUseCase,
  ) {}

  @Get()
  async handle(
    @Body(bodyValidationPipe) body: FetchPendingDeliveriesNearbyBodySchema,
    @CurrentUser() deliveryWorker: UserPayload,
  ) {
    const { page } = body
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
