import { Receiver } from '../entities/receiver'

export interface ReceiversRepository {
  findById(id: string): Promise<Receiver | null>
}
