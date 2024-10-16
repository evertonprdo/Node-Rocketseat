import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers.repository'
import { makeCourier } from 'test/factories/make-courier'
import { EditCourierUseCase } from '../edit-courier.use-case'

let fakeHasher: FakeHasher
let couriersRepository: InMemoryCouriersRepository
let sut: EditCourierUseCase

describe('Use Cases: Edit courier use case', () => {
  beforeEach(() => {
    couriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()

    sut = new EditCourierUseCase(couriersRepository, fakeHasher)
  })

  it('should edit courier', async () => {
    const courier = makeCourier({ password: await fakeHasher.hash('123456') })
    couriersRepository.items.push(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      name: 'John Doe',
      password: '654321',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      courier: expect.objectContaining({
        name: 'John Doe',
        password: await fakeHasher.hash('654321'),
      }),
    })

    expect(couriersRepository.items).toHaveLength(1)
  })
})
