import type { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

import { OrgsRepository } from '@/repositories/orgs-repository'

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
  constructor(private orgsRepository: OrgsRepository) {}

  async execute(
    data: RegisterOrgUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const { password, ...rest } = data

    const orgWithSameEmail = await this.orgsRepository.findByEmail(data.email)

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
