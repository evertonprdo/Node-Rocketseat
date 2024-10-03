import { OrgsRepository } from '@/repositories/orgs-repository'
import type { Org } from '@prisma/client'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

interface RegisterOrgUseCaseRequest {
  name: string
  email: string
  password: string
  whatsapp: string

  cep: string
  state: string
  city: string
  address: string

  latitude: number
  longitude: number
}

interface RegisterUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  private orgsRepository

  constructor(orgsRepository: OrgsRepository) {
    this.orgsRepository = orgsRepository
  }

  async execute({
    name,
    email,
    password,
    whatsapp,
    cep,
    state,
    city,
    address,
    latitude,
    longitude,
  }: RegisterOrgUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      password,
      whatsapp,
      cep,
      state,
      city,
      address,
      latitude,
      longitude,
    })

    return { org }
  }
}
