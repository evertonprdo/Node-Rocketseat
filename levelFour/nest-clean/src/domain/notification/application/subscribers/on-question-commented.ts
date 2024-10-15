import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { QuestionCommentedEvent } from '@/domain/forum/enterprise/events/question-commented-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionCommented implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewQuestionCommentedNotification.bind(this),
      QuestionCommentedEvent.name,
    )
  }

  private async sendNewQuestionCommentedNotification({
    questionComment,
  }: QuestionCommentedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (!question) {
      return
    }

    await this.sendNotificationUseCase.execute({
      recipientId: question.authorId.toString(),
      title: `New comment in your question ${question.title.substring(0, 20).concat('...')}!`,
      content: questionComment.content.substring(0, 40).concat('...'),
    })
  }
}
