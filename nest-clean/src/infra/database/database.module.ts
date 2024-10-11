import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'

import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'

const repositories = [
  PrismaQuestionsRepository,
  PrismaQuestionCommentsRepository,
  PrismaQuestionAttachmentsRepository,
  PrismaAnswersRepository,
  PrismaAnswerCommentsRepository,
  PrismaAnswerAttachmentsRepository,
]

@Module({
  providers: [PrismaService, ...repositories],
  exports: [PrismaService, ...repositories],
})
export class DatabaseModule {}
