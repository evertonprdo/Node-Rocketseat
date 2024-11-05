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

import { NestEditUserUseCase } from '@/infra/injectable-use-cases/admin/nest-edit-user.use-case'

const editUserBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  password: z.string(),
})

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

@Controller('/users/:id')
@Roles(Role.ADMIN)
export class EditUserController {
  constructor(private editUser: NestEditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @Param('id') userId: string,
  ) {
    const { name, password, phone } = body

    const result = await this.editUser.execute({
      userId,
      name,
      phone,
      password,
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
