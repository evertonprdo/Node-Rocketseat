import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AnswersRepository } from "@/domain/repositories/answers-repository"
import { Answer } from "@/domain/entities/answer"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository
  ) {}

  async execute({instructorId, questionId, content}: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      content,
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(instructorId),
    })

    await this.answersRepository.create(answer)

    return answer
  }
}