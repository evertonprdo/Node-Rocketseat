import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NestEditDeliveryWorkerUseCase } from '@/infra/injectable-use-cases/admin/nest-edit-delivery-worker.use-case'

const editDeliveryWorkerBodySchema = z.object({
  operationZone: z.string(),
})

type EditDeliveryWorkerBodySchema = z.infer<typeof editDeliveryWorkerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editDeliveryWorkerBodySchema)

@Controller('delivery-workers/:id')
@Roles(Role.ADMIN)
export class EditDeliveryWorkerController {
  constructor(private editDeliveryWorker: NestEditDeliveryWorkerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryWorkerBodySchema,
    @Param('id') deliveryWorkerId: string,
  ) {
    const { operationZone } = body

    const result = await this.editDeliveryWorker.execute({
      operationZone,
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
