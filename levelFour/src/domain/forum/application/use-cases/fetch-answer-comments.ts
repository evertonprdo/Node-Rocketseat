import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

import { AnswerComment } from '../../enterprise/entities/answer-comment'

import { Either, right } from '@/core/either'

interface FetchRecentAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchRecentAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchRecentAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchRecentAnswerCommentsUseCaseRequest): Promise<FetchRecentAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComments,
    })
  }
}
