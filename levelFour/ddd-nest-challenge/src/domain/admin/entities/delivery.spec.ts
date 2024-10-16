import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Delivery } from './delivery'

test('', () => {
  const delivery = Delivery.create({
    courierId: new UniqueEntityId(),
    customerId: new UniqueEntityId(),
    status: 'DELIVERED',
  })

  console.log(delivery.status)
})
