import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import { Either, right } from '@/core/either'

interface FetchRecentQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchRecentQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchRecentQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchRecentQuestionCommentsUseCaseRequest): Promise<FetchRecentQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({
      questionComments,
    })
  }
}
