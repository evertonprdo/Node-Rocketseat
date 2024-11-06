import {
  Param,
  Delete,
  HttpCode,
  Controller,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NestDeleteDeliveryUseCase } from '@/infra/injectable-use-cases/admin/nest-delete-delivery.use-case'

@Controller('/deliveries/:id')
@Roles(Role.ADMIN)
export class DeleteDeliveryController {
  constructor(private deleteDelivery: NestDeleteDeliveryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') deliveryId: string) {
    const result = await this.deleteDelivery.execute({
      deliveryId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
