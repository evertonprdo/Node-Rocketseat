import { makeUser } from '../_tests/factories/make-user'
import { makeCustomer } from '../_tests/factories/make-customer'
import { makeCEP } from '@/domain/_shared/_tests/factories/make-cep'

import { makeInMemoryCustomersRepository } from '../_tests/repositories/factories/make-in-memory-customers-repository'
import { makeInMemoryUsersRepository } from '../_tests/repositories/factories/make-in-memory-users-repository'

import { InMemoryCustomersRepository } from '../_tests/repositories/in-memory-customers.repository'
import { InMemoryUsersRepository } from '../_tests/repositories/in-memory-users.repository'

import { EmailAlreadyInUseError } from './errors/email-already-in-use.error'
import { UserAlreadyAssignedError } from './errors/user-already-assigned.error'

import { AssignCustomerUseCase } from './assign-customer.use-case'

let usersRepository: InMemoryUsersRepository
let customersRepository: InMemoryCustomersRepository

let sut: AssignCustomerUseCase

describe('Use Cases: Assign customer', () => {
  beforeEach(() => {
    usersRepository = makeInMemoryUsersRepository()
    customersRepository = makeInMemoryCustomersRepository()

    sut = new AssignCustomerUseCase(customersRepository, usersRepository)
  })

  it('should assign an user as customer', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'test@example.com',
      city: 'city',
      cep: makeCEP(),
      state: 'state',
      street: 'street',
      number: '537',
      neighborhood: 'test',
    })

    expect(result.isRight()).toEqual(true)

    expect(customersRepository.items).toHaveLength(1)
    expect(result.value).toEqual({
      customer: customersRepository.items[0],
    })
  })

  it('should not be able to assign with same email twice', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    customersRepository.items.push(makeCustomer({ email: 'same@email.com' }))

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'same@email.com',
      city: 'city',
      cep: makeCEP(),
      state: 'state',
      street: 'street',
      number: '537',
      neighborhood: 'test',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('should not be able to assign an user as customer twice', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    customersRepository.items.push(makeCustomer({ userId: user.id }))

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'any@email.com',
      city: 'city',
      cep: makeCEP(),
      state: 'state',
      street: 'street',
      number: '537',
      neighborhood: 'test',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(UserAlreadyAssignedError)
  })
})
