import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import request from 'supertest'

import { StudentFactory } from 'test/factories/make-student'
import { AnswerFactory } from 'test/factories/make-answer'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'

describe('Comment on answer (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New comment',
      })

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New comment',
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
