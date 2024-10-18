export interface HashCompare {
  hash(plain: string): Promise<string>
}
