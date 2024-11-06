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

import { InvalidCEPError } from '@/domain/admin/use-cases/errors/invalid-cep.error'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NestEditCustomerUseCase } from '@/infra/injectable-use-cases/admin/nest-edit-customer.use-case'

const editCustomerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cep: z.string(),
  city: z.string(),
  state: z.string(),
  street: z.string(),
  number: z.coerce.string(),
  neighborhood: z.string(),
})

type EditCustomerBodySchema = z.infer<typeof editCustomerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editCustomerBodySchema)

@Controller('/customers/:id')
@Roles(Role.ADMIN)
export class EditCustomerController {
  constructor(private editCustomer: NestEditCustomerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCustomerBodySchema,
    @Param('id') customerId: string,
  ) {
    const { cep, city, name, email, neighborhood, number, state, street } = body

    const result = await this.editCustomer.execute({
      cep,
      city,
      customerId,
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

        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
