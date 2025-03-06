import { Injectable } from '@nestjs/common'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions-repository'

@Injectable()
export class NestCreateQuestionUseCase extends CreateQuestionUseCase {
  constructor(questionsRepository: PrismaQuestionsRepository) {
    super(questionsRepository)
  }
}
