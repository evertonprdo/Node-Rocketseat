import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!questionComment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const take = 20

    const questions = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip: (page - 1) * take,
    })

    return questions.map(PrismaQuestionCommentMapper.toDomain)
  }

  async create(questionComment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(questionComment: QuestionComment) {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}
