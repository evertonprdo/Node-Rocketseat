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

import { NestUnassignAdminUseCase } from '@/infra/injectable-use-cases/admin/nest-unassign-admin.use-case'

@Controller('/admins/:id')
@Roles(Role.ADMIN)
export class UnassignAdminController {
  constructor(private unassignAdmin: NestUnassignAdminUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') adminId: string) {
    const result = await this.unassignAdmin.execute({
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
