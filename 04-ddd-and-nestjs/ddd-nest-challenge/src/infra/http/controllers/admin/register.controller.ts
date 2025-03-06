import {
  Body,
  Post,
  Controller,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Public } from '@/infra/auth/public'
import { NestRegisterUseCase } from '@/infra/injectable-use-cases/admin/nest-register.use-case'

import { InvalidCPFError } from '@/domain/_shared/errors/invalid-cpf.error'
import { UserAlreadyExistError } from '@/domain/admin/use-cases/errors/user-already-exists.error'

const registerBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  phone: z.string(),
})

type RegisterBodySchema = z.infer<typeof registerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(registerBodySchema)

@Controller('/users/register')
@Public()
export class RegisterController {
  constructor(private register: NestRegisterUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RegisterBodySchema) {
    const { name, cpf, password, phone } = body

    const result = await this.register.execute({
      name,
      cpf,
      password,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCPFError:
          throw new BadRequestException(error.message)

        case UserAlreadyExistError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
