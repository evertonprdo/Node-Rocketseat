import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { AnswerCommentedEvent } from '@/domain/forum/enterprise/events/answer-commented-event'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

import { SendNotificationUseCase } from '../use-cases/send-notification-use-case'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

export class OnAnswerCommented implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerCommentedNotification.bind(this),
      AnswerCommentedEvent.name,
    )
  }

  private async sendNewAnswerCommentedNotification({
    answerComment,
  }: AnswerCommentedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (!answer) {
      return
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return
    }

    await this.sendNotificationUseCase.execute({
      recipientId: answer.authorId.toString(),
      title: `New comment in your answer to ${question.title.substring(0, 20).concat('...')}!`,
      content: answerComment.content.substring(0, 40).concat('...'),
    })
  }
}
