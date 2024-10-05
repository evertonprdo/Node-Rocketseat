import type { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

import { OrgsRepository } from '@/repositories/orgs-repository'

interface CreateOrgUseCaseRequest {
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

interface CreateUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(data: CreateOrgUseCaseRequest): Promise<CreateUseCaseResponse> {
    const { password, ...rest } = data

    const orgWithSameEmail = await this.orgsRepository.findByEmail(data.email)

    throw Error()

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      ...rest,
      password: passwordHash,
    })

    return { org }
  }
}
