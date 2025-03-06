import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { DeliveryWorkerDetailsPresenter } from '../../presenters/admin/delivery-worker-details.presenter'
import { NestGetDeliveryWorkerUseCase } from '@/infra/injectable-use-cases/admin/nest-get-delivery-worker.use-case'

@Controller('/delivery-workers/:id')
@Roles(Role.ADMIN)
export class GetDeliveryWorkerController {
  constructor(private getDeliveryWorker: NestGetDeliveryWorkerUseCase) {}

  @Get()
  async handle(@Param('id') deliveryWorkerId: string) {
    const result = await this.getDeliveryWorker.execute({
      deliveryWorkerId,
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
      deliveryWorker: DeliveryWorkerDetailsPresenter.toHTTP(
        result.value.deliveryWorker,
      ),
    }
  }
}
