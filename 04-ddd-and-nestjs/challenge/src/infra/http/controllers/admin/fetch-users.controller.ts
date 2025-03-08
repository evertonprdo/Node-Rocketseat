import { BadRequestException, Query, Controller, Get } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { UserPresenter } from '../../presenters/admin/user.presenter'
import { NestFetchUsersUseCase } from '@/infra/injectable-use-cases/admin/nest-fetch-users.use-case'

const fetchUsersQuerySchema = z.object({
  page: z.coerce.number().default(1),
})

type FetchUsersQuerySchema = z.infer<typeof fetchUsersQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchUsersQuerySchema)

@Controller('/users')
@Roles(Role.ADMIN)
export class FetchUsersController {
  constructor(private fetchUsers: NestFetchUsersUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchUsersQuerySchema) {
    const { page } = query

    const result = await this.fetchUsers.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { users: result.value.users.map(UserPresenter.toHTTP) }
  }
}
