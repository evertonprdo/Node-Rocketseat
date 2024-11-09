import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AccessTokenPayloadProps {
  sub: string
  adminId: string | null
  deliveryWorkerId: string | null
}

@Injectable()
export class AccessTokenFactory {
  constructor(private jwt: JwtService) {}

  makeAdmin(overwrite: Partial<AccessTokenPayloadProps> = {}) {
    return this.jwt.sign({
      sub: new UniqueEntityId().toString(),
      adminId: new UniqueEntityId().toString(),
      deliveryWorkerId: null,
      ...overwrite,
    })
  }

  makeDeliveryWorker(overwrite: Partial<AccessTokenPayloadProps> = {}) {
    return this.jwt.sign({
      sub: new UniqueEntityId().toString(),
      adminId: null,
      deliveryWorkerId: new UniqueEntityId().toString(),
      ...overwrite,
    })
  }

  makeUser(overwrite: Partial<AccessTokenPayloadProps> = {}) {
    return this.jwt.sign({
      sub: new UniqueEntityId().toString(),
      adminId: null,
      deliveryWorkerId: null,
      ...overwrite,
    })
  }
}
