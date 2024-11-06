import {
  Get,
  Param,
  Controller,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { DeliveryDetailsPresenter } from '../../presenters/admin/delivery-details.presenter'
import { NestGetDeliveryDetailsUseCase } from '@/infra/injectable-use-cases/admin/nest-get-delivery-details.use-case'

@Controller('/deliveries/:id')
@Roles(Role.ADMIN)
export class GetDeliveryDetailsController {
  constructor(private getDeliveryDetails: NestGetDeliveryDetailsUseCase) {}

  @Get()
  async handle(@Param('id') deliveryId: string) {
    const result = await this.getDeliveryDetails.execute({
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

    return {
      delivery: DeliveryDetailsPresenter.toHTTP(result.value.deliveryDetails),
    }
  }
}
