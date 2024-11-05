import {
  Post,
  Body,
  HttpCode,
  UsePipes,
  Controller,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import { Public } from '@/infra/auth/public'
import { NestAuthenticateUseCase } from '@/infra/injectable-use-cases/authentication/nest-authenticate.use-case'

import { WrongCredentialsError } from '@/domain/authentication/use-cases/errors/wrong-credentials-error'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth/login')
@Public()
export class AuthenticateController {
  constructor(private authenticateUseCase: NestAuthenticateUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateUseCase.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
