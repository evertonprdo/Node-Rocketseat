import { hash, compare } from 'bcryptjs'

import { HashCompare } from '@/domain/authentication/cryptography/hash-compare'
import { HashGenerator } from '@/domain/admin/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashCompare {
  private HASH_SALT_LENGTH = 8

  hash(plain: string) {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string) {
    return compare(plain, hash)
  }
}
