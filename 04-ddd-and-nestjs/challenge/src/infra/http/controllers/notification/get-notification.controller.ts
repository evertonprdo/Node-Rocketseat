import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { NotAllowedError } from '@/domain/_shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'

import { NotificationPresenter } from '../../presenters/notification/notification.presenter'
import { NestGetNotificationUseCase } from '@/infra/injectable-use-cases/notification/nest-get-notification.use-case'

@Controller('/notifications/:id')
@Roles(Role.USER)
export class GetNotificationController {
  constructor(private getNotification: NestGetNotificationUseCase) {}

  @Get()
  async handle(
    @Param('id') notificationId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: recipientId } = user

    const result = await this.getNotification.execute({
      notificationId,
      recipientId,
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

    return {
      notification: NotificationPresenter.toHTTP(result.value.notification),
    }
  }
}
