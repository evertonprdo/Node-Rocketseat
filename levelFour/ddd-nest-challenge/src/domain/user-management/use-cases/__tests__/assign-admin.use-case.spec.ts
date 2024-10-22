import { InMemoryUsersRepository } from '../../__tests__/repositories/in-memory-users.repository'

import { makeUser } from '../../__tests__/factories/makeUser'
import { InMemoryAdminsRepository } from '../../__tests__/repositories/in-memory-admins.repository'
import { AssignAdminUseCase } from '../assign-admin.use-case'

let usersRepository: InMemoryUsersRepository
let adminsRepository: InMemoryAdminsRepository

let sut: AssignAdminUseCase

describe('Use Cases: Register user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    adminsRepository = new InMemoryAdminsRepository()

    sut = new AssignAdminUseCase(usersRepository, adminsRepository)
  })

  it('should assign an user as delivery worker', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toEqual(true)

    expect(adminsRepository.items).toHaveLength(1)
    expect(adminsRepository.items[0].id).toEqual(user.id)
  })
})
