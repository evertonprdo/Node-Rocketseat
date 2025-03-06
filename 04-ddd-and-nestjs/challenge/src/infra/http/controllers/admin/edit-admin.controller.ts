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

import { NestEditAdminUseCase } from '@/infra/injectable-use-cases/admin/nest-edit-admin.use-case'

const editAdminBodySchema = z.object({
  email: z.string().email(),
})

type EditAdminBodySchema = z.infer<typeof editAdminBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAdminBodySchema)

@Controller('admins/:id')
@Roles(Role.ADMIN)
export class EditAdminController {
  constructor(private editAdmin: NestEditAdminUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAdminBodySchema,
    @Param('id') adminId: string,
  ) {
    const { email } = body

    const result = await this.editAdmin.execute({
      email,
      adminId,
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
