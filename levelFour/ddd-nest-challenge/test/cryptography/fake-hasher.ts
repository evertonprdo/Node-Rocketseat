import { HashGenerator } from '@/domain/admin/cryptography/hash-compare'
import { HashCompare } from '@/domain/admin/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashCompare {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
