import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NestCreateDeliveryUseCase } from '@/infra/injectable-use-cases/admin/nest-create-delivery.use-case'

const createDeliveryBodySchema = z.object({
  customerId: z.string().uuid(),
})

type CreateDeliveryBodySchema = z.infer<typeof createDeliveryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createDeliveryBodySchema)

@Controller('/deliveries')
@Roles(Role.ADMIN)
export class CreateDeliveryController {
  constructor(private createDelivery: NestCreateDeliveryUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateDeliveryBodySchema) {
    const { customerId } = body

    const result = await this.createDelivery.execute({
      customerId,
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
