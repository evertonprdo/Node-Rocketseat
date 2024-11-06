import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { InvalidCEPError } from '@/domain/admin/use-cases/errors/invalid-cep.error'
import { EmailAlreadyInUseError } from '@/domain/admin/use-cases/errors/email-already-in-use.error'

import { NestCreateCustomerUseCase } from '@/infra/injectable-use-cases/admin/nest-create-customer.use-case'

const createCustomerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cep: z.string(),
  city: z.string(),
  state: z.string(),
  street: z.string(),
  number: z.coerce.string(),
  neighborhood: z.string(),
})

type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createCustomerBodySchema)

@Controller('/customers')
@Roles(Role.ADMIN)
export class CreateCustomerController {
  constructor(private createCustomer: NestCreateCustomerUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateCustomerBodySchema) {
    const { name, email, cep, city, neighborhood, number, state, street } = body

    const result = await this.createCustomer.execute({
      cep,
      city,
      email,
      name,
      neighborhood,
      number,
      state,
      street,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCEPError:
          throw new BadRequestException(error.message)

        case EmailAlreadyInUseError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
