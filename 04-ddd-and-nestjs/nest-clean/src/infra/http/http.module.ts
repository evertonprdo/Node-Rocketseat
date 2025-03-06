import { Module } from '@nestjs/common'

import { StorageModule } from '../storage/storage.module'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'

import { EditQuestionController } from './controllers/edit-question.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-best-question.controller'

import { CommentOnAnswerController } from './controllers/comment-on-answer.controller'
import { CommentOnQuestionController } from './controllers/comment-on-question.controller'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller'
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller'

import { EditAnswerController } from './controllers/edit-answer.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { FetchQuestionAnswersController } from './controllers/fetch-questions-answers.controller'

import { ReadNotificationController } from './controllers/read-notification.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachments'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    EditAnswerController,
    DeleteAnswerController,
    EditQuestionController,
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    CommentOnAnswerController,
    UploadAttachmentController,
    ReadNotificationController,
    CommentOnQuestionController,
    GetQuestionBySlugController,
    DeleteAnswerCommentController,
    FetchAnswerCommentsController,
    FetchRecentQuestionsController,
    FetchQuestionAnswersController,
    FetchQuestionCommentsController,
    DeleteQuestionCommentController,
    ChooseQuestionBestAnswerController,
  ],
  providers: [
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    EditQuestionUseCase,
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    RegisterStudentUseCase,
    CommentOnAnswerUseCase,
    ReadNotificationUseCase,
    GetQuestionBySlugUseCase,
    CommentOnQuestionUseCase,
    DeleteAnswerCommentUseCase,
    AuthenticateStudentUseCase,
    FetchAnswerCommentsUseCase,
    FetchRecentQuestionsUseCase,
    FetchQuestionAnswersUseCase,
    DeleteQuestionCommentUseCase,
    FetchQuestionCommentsUseCase,
    ChooseQuestionBestAnswerUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
