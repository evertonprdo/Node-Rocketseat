import { makeAdmin } from '../_tests/factories/make-admin'
import { makeInMemoryAdminsRepository } from '../_tests/repositories/factories/make-in-memory-admins-repository'

import { InMemoryAdminsRepository } from '../_tests/repositories/in-memory-admins.repository'

import { EditAdminUseCase } from './edit-admin.use-case'

let adminsRepository: InMemoryAdminsRepository

let sut: EditAdminUseCase

describe('Use Cases: Edit Delivery Worker', () => {
  beforeEach(() => {
    adminsRepository = makeInMemoryAdminsRepository()

    sut = new EditAdminUseCase(adminsRepository)
  })

  it('should edit an admin', async () => {
    const admin = makeAdmin({ email: 'old@mail.com' })
    adminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      email: 'new-city',
    })

    expect(result.isRight()).toEqual(true)
    expect(adminsRepository.items).toHaveLength(1)

    expect(result.value).toEqual({
      admin: adminsRepository.items[0],
    })
  })
})
