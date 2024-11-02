import { makeUser } from '../_tests/factories/make-user'
import { makeAdmin } from '../_tests/factories/make-admin'

import { makeInMemoryAdminsRepository } from '../_tests/repositories/factories/make-in-memory-admins-repository'

import { InMemoryAdminsRepository } from '../_tests/repositories/in-memory-admins.repository'

import { GetAdminUseCase } from './get-admin.use-case'

let adminsRepository: InMemoryAdminsRepository

let sut: GetAdminUseCase

describe('Use Cases: Get Admin', () => {
  beforeEach(() => {
    adminsRepository = makeInMemoryAdminsRepository()

    sut = new GetAdminUseCase(adminsRepository)
  })

  it('should get an admin', async () => {
    const user = makeUser()
    adminsRepository.usersRepository.items.push(user)

    const admin = makeAdmin({ userId: user.id })
    adminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(result.value).toEqual({
      admin: expect.objectContaining({
        userId: user.id,
        adminId: admin.id,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        email: admin.email,
      }),
    })
  })
})
