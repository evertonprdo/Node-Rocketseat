import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { AnswerComment } from '../entities/answer-comment'

export class AnswerCommentedEvent implements DomainEvent {
  public answerComment: AnswerComment
  public ocurredAt: Date

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answerComment.id
  }
}
