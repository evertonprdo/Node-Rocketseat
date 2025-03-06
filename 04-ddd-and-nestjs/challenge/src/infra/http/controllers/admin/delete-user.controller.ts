import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NestDeleteUserUseCase } from '@/infra/injectable-use-cases/admin/nest-delete-user.use-case'

@Controller('/users/:id')
@Roles(Role.ADMIN)
export class DeleteUserController {
  constructor(private deleteUser: NestDeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') userId: string) {
    const result = await this.deleteUser.execute({
      userId,
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
