import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'

import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register twice with same email', async () => {
    inMemoryStudentsRepository.create(
      makeStudent({ email: 'johndoe@example.com' }),
    )

    const result = await sut.execute(
      makeStudent({ email: 'johndoe@example.com' }),
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })
})
