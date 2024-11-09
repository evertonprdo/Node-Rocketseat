import {
  Param,
  HttpCode,
  Controller,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Patch,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryBeingMadeByWrongDeliveryWorkerError } from '@/domain/delivery/use-cases/errors/delivery-being-made-by-the-wrong-delivery-worker'

import { NestMarkDeliveryAsReturnedUseCase } from '@/infra/injectable-use-cases/delivery/nest-mark-delivery-as-returned.use-case'

@Controller('/app/deliveries/:id/return')
@Roles(Role.DELIVERY_WORKER)
export class MarkDeliveryAsReturnedController {
  constructor(
    private markDeliveryAsReturned: NestMarkDeliveryAsReturnedUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') deliveryId: string,
    @CurrentUser() deliveryWorker: UserPayload,
  ) {
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.markDeliveryAsReturned.execute({
      deliveryId,
      deliveryWorkerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        case DeliveryBeingMadeByWrongDeliveryWorkerError:
          throw new ForbiddenException(error.message)

        default:
          throw new BadRequestException()
      }
    }
  }
}
