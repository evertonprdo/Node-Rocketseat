import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

import { QuestionComment } from '../../enterprise/entities/question-comment'

interface FetchRecentQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

interface FetchRecentQuestionCommentsUseCaseResponse {
  questionComments: QuestionComment[]
}

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

    return {
      questionComments,
    }
  }
}
