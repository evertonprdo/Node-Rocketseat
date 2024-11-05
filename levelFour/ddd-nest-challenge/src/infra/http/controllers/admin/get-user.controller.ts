import {
  Get,
  Param,
  Controller,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPresenter } from '../../presenters/admin/user.presenter'
import { NestGetUserUseCase } from '@/infra/injectable-use-cases/admin/nest-get-user.use-case'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

@Controller('/users/:userId')
@Roles(Role.ADMIN)
export class GetUserController {
  constructor(private getUser: NestGetUserUseCase) {}

  @Get()
  async handle(@Param('userId') userId: string) {
    const result = await this.getUser.execute({ userId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    return { user: UserPresenter.toHTTP(result.value.user) }
  }
}
