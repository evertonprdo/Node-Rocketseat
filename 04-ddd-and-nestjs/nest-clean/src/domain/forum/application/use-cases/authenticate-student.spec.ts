import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { makeStudent } from 'test/factories/make-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

import { WrongCredentialsError } from './errors/wrong-credentials-error'

import { AuthenticateStudentUseCase } from './authenticate-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.items.push(student)

    const result = await sut.execute({
      email: student.email,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ accessToken: expect.any(String) })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    inMemoryStudentsRepository.items.push(
      makeStudent({
        email: 'correct@email.com',
        password: await fakeHasher.hash('correct-password'),
      }),
    )

    const result = await sut.execute({
      email: 'wrong@email.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
