export interface HashGenerator {
  compare(plain: string, hash: string): Promise<boolean>
}
