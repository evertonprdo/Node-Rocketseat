import { HashCompare } from '@/domain/delivery/cryptography/hash-compare'
import { HashGenerator } from '@/domain/delivery/cryptography/hash-generator'

export class FakeHasher implements HashCompare, HashCompare {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
