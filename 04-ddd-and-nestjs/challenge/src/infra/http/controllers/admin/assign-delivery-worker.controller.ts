import {
  Body,
  Post,
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { UserAlreadyAssignedError } from '@/domain/admin/use-cases/errors/user-already-assigned.error'

import { NestAssignDeliveryWorkerUseCase } from '@/infra/injectable-use-cases/admin/nest-assign-delivery-worker.use-case'

const assignDeliveryWorkerBodySchema = z.object({
  userId: z.string().uuid(),
  operationZone: z.string(),
})

type AssignDeliveryWorkerBodySchema = z.infer<
  typeof assignDeliveryWorkerBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(assignDeliveryWorkerBodySchema)

@Controller('/delivery-workers/assign')
@Roles(Role.ADMIN)
export class AssignDeliveryWorkerController {
  constructor(private assignDeliveryWorker: NestAssignDeliveryWorkerUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: AssignDeliveryWorkerBodySchema) {
    const { operationZone, userId } = body

    const result = await this.assignDeliveryWorker.execute({
      userId,
      operationZone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        case UserAlreadyAssignedError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
