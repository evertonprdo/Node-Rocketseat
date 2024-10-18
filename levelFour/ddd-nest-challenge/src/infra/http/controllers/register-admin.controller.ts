import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { z } from 'zod'

import { InvalidCPFError } from '@/domain/delivery/use-cases/errors/invalid-cpf.error'
import { AdminAlreadyExistError } from '@/domain/delivery/use-cases/errors/admin-already-exists.error'

import { NestRegisterAdminUseCase } from '@/infra/use-cases/delivery/nest-register-admin.use-case'

const registerAdminBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>

@Controller('/admin/register')
export class RegisterAdminController {
  constructor(private registerAdminUseCase: NestRegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: RegisterAdminBodySchema) {
    const { name, cpf, password } = registerAdminBodySchema.parse(body)

    const result = await this.registerAdminUseCase.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCPFError:
          throw new BadRequestException(error.message)
        case AdminAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
