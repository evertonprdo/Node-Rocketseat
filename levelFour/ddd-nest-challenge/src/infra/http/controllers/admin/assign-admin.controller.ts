import {
  Body,
  Post,
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Role } from '@/infra/auth/roles/role.enum'
import { Roles } from '@/infra/auth/roles/roles.decorator'

import { NestAssignAdminUseCase } from '@/infra/injectable-use-cases/admin/nest-assign-admin.use-case'

import { EmailAlreadyInUseError } from '@/domain/admin/use-cases/errors/email-already-in-use.error'
import { ResourceNotFoundError } from '@/domain/_shared/errors/resource-not-found.error'
import { UserAlreadyAssignedError } from '@/domain/admin/use-cases/errors/user-already-assigned.error'

const assignAdminBodySchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
})

type AssignAdminBodySchema = z.infer<typeof assignAdminBodySchema>

const bodyValidationPipe = new ZodValidationPipe(assignAdminBodySchema)

@Controller('/admins/assign')
@Roles(Role.ADMIN)
export class AssignAdminController {
  constructor(private assignAdminUseCase: NestAssignAdminUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: AssignAdminBodySchema) {
    const { email, userId } = body

    const result = await this.assignAdminUseCase.execute({
      userId,
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyInUseError:
          throw new ConflictException(error.message)

        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        case UserAlreadyAssignedError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
