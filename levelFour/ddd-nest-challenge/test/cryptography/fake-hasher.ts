import { HashCompare } from '@/domain/authentication/cryptography/hash-compare'
import { HashGenerator } from '@/domain/authentication/cryptography/hash-generator'

export class FakeHasher implements HashCompare, HashCompare {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
