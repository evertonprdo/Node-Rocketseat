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

import { NestUnassignDeliveryWorkerUseCase } from '@/infra/injectable-use-cases/admin/nest-unassign-delivery-worker.use-case'

@Controller('/delivery-workers/:id')
@Roles(Role.ADMIN)
export class UnassignDeliveryWorkerController {
  constructor(
    private unassignDeliveryWorker: NestUnassignDeliveryWorkerUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') deliveryWorkerId: string) {
    const result = await this.unassignDeliveryWorker.execute({
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
  }
}
