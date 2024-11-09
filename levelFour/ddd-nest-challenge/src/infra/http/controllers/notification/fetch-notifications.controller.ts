import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { NotificationPresenter } from '../../presenters/notification/notification.presenter'
import { NestFetchRecipientNotificationsUseCase } from '@/infra/injectable-use-cases/notification/nest-fetch-recipient-notifications.use-case'

const fetchNotificationsParamsSchema = z.object({
  page: z.coerce.number().default(1),
  unreadyOnly: z.coerce.boolean().default(false),
})

type FetchNotificationsParamsSchema = z.infer<
  typeof fetchNotificationsParamsSchema
>

const queryValidationPipe = new ZodValidationPipe(
  fetchNotificationsParamsSchema,
)

@Controller('/notifications')
@Roles(Role.USER)
export class FetchNotificationsController {
  constructor(
    private fetchRecipientNotifications: NestFetchRecipientNotificationsUseCase,
  ) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) params: FetchNotificationsParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: recipientId } = user
    const { page, unreadyOnly } = params

    const result = await this.fetchRecipientNotifications.execute({
      recipientId,
      unreadyOnly,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      notifications: result.value.notifications.map(
        NotificationPresenter.toHTTP,
      ),
    }
  }
}
