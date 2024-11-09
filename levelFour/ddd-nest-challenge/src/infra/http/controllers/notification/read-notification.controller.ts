import {
  Param,
  Patch,
  HttpCode,
  Controller,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { NotAllowedError } from '@/domain/_shared/errors/not-allowed-error'

import { NestReadNotificationUseCase } from '@/infra/injectable-use-cases/notification/nest-read-notification.use-case'

@Controller('/notifications/:id')
@Roles(Role.USER)
export class ReadNotificationController {
  constructor(private readNotification: NestReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') notificationId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: userId } = user

    const result = await this.readNotification.execute({
      notificationId,
      recipientId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        case NotAllowedError:
          throw new ForbiddenException(error.message)

        default:
          throw new BadRequestException()
      }
    }
  }
}
