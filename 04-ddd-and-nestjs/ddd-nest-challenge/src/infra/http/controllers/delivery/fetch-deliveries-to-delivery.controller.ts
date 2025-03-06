import { BadRequestException, Controller, Get } from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeliveryPresenter } from '../../presenters/delivery/delivery.presenter'
import { NestFetchDeliveriesToDeliveryUseCase } from '@/infra/injectable-use-cases/delivery/nest-fetch-deliveries-to-delivery'

@Controller('/app/deliveries/to-delivery')
@Roles(Role.DELIVERY_WORKER)
export class FetchDeliveriesToDeliveryController {
  constructor(
    private fetchDeliveriesToDelivery: NestFetchDeliveriesToDeliveryUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() deliveryWorker: UserPayload) {
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.fetchDeliveriesToDelivery.execute({
      deliveryWorkerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { deliveries: result.value.deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
