import { makeAdmin } from '../_tests/factories/make-admin'
import { makeInMemoryAdminsRepository } from '../_tests/repositories/factories/make-in-memory-admins-repository'

import { InMemoryAdminsRepository } from '../_tests/repositories/in-memory-admins.repository'

import { UnassignAdminUseCase } from './unassign-admin.use-case'

let adminsRepository: InMemoryAdminsRepository

let sut: UnassignAdminUseCase

describe('Use Cases: Unassign Admin', () => {
  beforeEach(() => {
    adminsRepository = makeInMemoryAdminsRepository()

    sut = new UnassignAdminUseCase(adminsRepository)
  })

  it('should be able to unassign an admin', async () => {
    const admin = makeAdmin()
    adminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(adminsRepository.items).toHaveLength(0)
  })
})
