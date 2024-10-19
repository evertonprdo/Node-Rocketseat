import { HashGenerator } from '@/domain/user-management/cryptography/hash-generator'
import { HashCompare } from '@/domain/authentication/cryptography/hash-compare'

export class FakeHasher implements HashCompare, HashGenerator {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
