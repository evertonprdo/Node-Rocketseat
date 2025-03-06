import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'
import { InMemoryAdminsRepository } from '../_tests/repositories/in-memory-admins.repository'

import { makeUser } from '../_tests/factories/make-user'
import { makeAdmin } from '../_tests/factories/make-admin'

import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'
import { makeInMemoryAdminsRepository } from '../_tests/repositories/factories/make-in-memory-admins-repository'

import { EmailAlreadyInUseError } from './errors/email-already-in-use.error'
import { UserAlreadyAssignedError } from './errors/user-already-assigned.error'

import { AssignAdminUseCase } from './assign-admin.use-case'

let usersRepository: InMemoryUsersRepository
let adminsRepository: InMemoryAdminsRepository

let sut: AssignAdminUseCase

describe('Use Cases: Assign admin', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()
    adminsRepository = makeInMemoryAdminsRepository()

    sut = new AssignAdminUseCase(usersRepository, adminsRepository)
  })

  it('should assign an user as admin', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'test@mail.com',
    })

    expect(result.isRight()).toEqual(true)

    expect(adminsRepository.items).toHaveLength(1)
    expect(adminsRepository.items[0].email).toEqual('test@mail.com')

    expect(adminsRepository.items[0].userId.equals(user.id)).toEqual(true)
  })

  it('should not be able register with same email twice', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    adminsRepository.items.push(makeAdmin({ email: 'test@mail.com' }))

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'test@mail.com',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('should not be able to assign an user as admin twice', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    adminsRepository.items.push(
      makeAdmin({ email: 'first@mail.com', userId: user.id }),
    )

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'second@mail.com',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserAlreadyAssignedError)
  })
})
