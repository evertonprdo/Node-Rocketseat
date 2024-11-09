import {
  Param,
  HttpCode,
  Controller,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Body,
  Patch,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { DeliveryWrongStatusError } from '@/domain/delivery/use-cases/errors/delivery-wrong-status.error'
import { DeliveryAlreadyPickedUpError } from '@/domain/delivery/use-cases/errors/delivery-already-picked-up.error'

import { NestMarkDeliveryAsDeliveredUseCase } from '@/infra/injectable-use-cases/delivery/nest-mark-delivery-as-delivered.use-case'

const markDeliveryAsDeliveredBodySchema = z.object({
  attachmentId: z.string().uuid(),
})

type MarkDeliveryAsDeliveredBodySchema = z.infer<
  typeof markDeliveryAsDeliveredBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
  markDeliveryAsDeliveredBodySchema,
)

@Controller('/app/deliveries/:id/deliver')
@Roles(Role.DELIVERY_WORKER)
export class MarkDeliveryAsDeliveredController {
  constructor(
    private markDeliveryAsDelivered: NestMarkDeliveryAsDeliveredUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') deliveryId: string,
    @CurrentUser() deliveryWorker: UserPayload,
    @Body(bodyValidationPipe) body: MarkDeliveryAsDeliveredBodySchema,
  ) {
    const { attachmentId } = body
    const { deliveryWorkerId } = deliveryWorker

    if (!deliveryWorkerId) {
      throw new BadRequestException()
    }

    const result = await this.markDeliveryAsDelivered.execute({
      deliveryId,
      deliveryWorkerId,
      attachmentId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        case DeliveryAlreadyPickedUpError:
          throw new ConflictException(error.message)

        case DeliveryWrongStatusError:
          throw new BadRequestException(error.message)

        default:
          throw new BadRequestException()
      }
    }
  }
}
