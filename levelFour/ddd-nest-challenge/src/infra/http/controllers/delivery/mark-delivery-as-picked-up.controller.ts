import {
  Put,
  Param,
  HttpCode,
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryAlreadyPickedUpError } from '@/domain/delivery/use-cases/errors/delivery-already-picked-up.error'

import { NestMarkDeliveryAsPickedUpUseCase } from '@/infra/injectable-use-cases/delivery/nest-mark-delivery-as-picked-up.use-case'

@Controller('/app/deliveries/:id/pick-up')
@Roles(Role.DELIVERY_WORKER)
export class MarkDeliveryAsPickedUpController {
  constructor(
    private markDeliveryAsPickedUp: NestMarkDeliveryAsPickedUpUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') deliveryId: string,
    @CurrentUser() deliveryWorker: UserPayload,
  ) {
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.markDeliveryAsPickedUp.execute({
      deliveryId,
      deliveryWorkerId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        case DeliveryAlreadyPickedUpError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException()
      }
    }
  }
}
