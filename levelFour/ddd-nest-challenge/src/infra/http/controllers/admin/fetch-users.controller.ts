import { BadRequestException, Body, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPresenter } from '../../presenters/admin/user.presenter'
import { NestFetchUsersUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-users.use-case'

const fetchUsersBodySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchUsersBodySchema = z.infer<typeof fetchUsersBodySchema>

const bodyValidationPipe = new ZodValidationPipe(fetchUsersBodySchema)

@Controller('/users')
@Roles(Role.ADMIN)
export class FetchUsersController {
  constructor(private fetchUsers: NestFetchUsersUseCase) {}

  @Get()
  async handle(@Body(bodyValidationPipe) body: FetchUsersBodySchema) {
    const { page } = body

    const result = await this.fetchUsers.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { users: result.value.users.map(UserPresenter.toHTTP) }
  }
}
