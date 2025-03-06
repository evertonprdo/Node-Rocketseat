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

import { AdminDetailsPresenter } from '../../presenters/admin/admin-details.presenter'
import { NestGetAdminUseCase } from '@/infra/injectable-use-cases/admin/nest-get-admin.use-case'

@Controller('/admins/:id')
@Roles(Role.ADMIN)
export class GetAdminController {
  constructor(private getAdmin: NestGetAdminUseCase) {}

  @Get()
  async handle(@Param('id') adminId: string) {
    const result = await this.getAdmin.execute({
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

    return { admin: AdminDetailsPresenter.toHTTP(result.value.admin) }
  }
}
