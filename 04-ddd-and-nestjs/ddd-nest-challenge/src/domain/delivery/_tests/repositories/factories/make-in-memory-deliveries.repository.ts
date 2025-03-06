import { InMemoryDeliveriesRepository } from '../in-memory-deliveries.repository'
import { InMemoryReceiversRepository } from '../in-memory-receivers.repository'
import { InMemoryDeliveryWorkersRepository } from '../in-memory-delivery-workers.repository'
import { InMemoryAttachmentsRepository } from '@/domain/_shared/_tests/repositores/in-memory-attachments.repository'
import { InMemoryDeliveryAttachmentsRepository } from '@/domain/_shared/_tests/repositores/in-memory-delivery-attachments.repository'

export function makeInMemoryDeliveriesRepository() {
  const receiversRepository = new InMemoryReceiversRepository()
  const deliveryWorkersRepository = new InMemoryDeliveryWorkersRepository()
  const attachmentsRepository = new InMemoryAttachmentsRepository()

  const deliveryAttachmentsRepository =
    new InMemoryDeliveryAttachmentsRepository()

  return new InMemoryDeliveriesRepository(
    deliveryWorkersRepository,
    receiversRepository,
    deliveryAttachmentsRepository,
    attachmentsRepository,
  )
}
