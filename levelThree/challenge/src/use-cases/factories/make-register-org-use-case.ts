import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgUseCase } from '../register-org-use-case'

export function makeRegisterOrgUseCase() {
  const orgsRepository = new InMemoryOrgsRepository()
  const useCase = new RegisterOrgUseCase(orgsRepository)

  return useCase
}
