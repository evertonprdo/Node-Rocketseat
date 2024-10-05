import { Org } from '@prisma/client'
import { OrgsRepository } from '@/repositories/orgs-repository'

interface FetchNearbyOrgsUseCaseRequest {
  latitude: number
  longitude: number
}

interface FetchNearbyOrgsUseCaseResponse {
  orgs: Org[]
}

export class FetchNearbyOrgsUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(
    params: FetchNearbyOrgsUseCaseRequest,
  ): Promise<FetchNearbyOrgsUseCaseResponse> {
    const orgs = await this.orgsRepository.findManyNearby(params)

    return { orgs }
  }
}
