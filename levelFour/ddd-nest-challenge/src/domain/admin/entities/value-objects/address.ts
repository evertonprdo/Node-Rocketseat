import { CEP } from './cep'

export class Address {
  constructor(
    public cep: CEP,
    public state: string,
    public city: string,
    public street: string,
    public number: string,
    public neighborhood: string,
  ) {}
}
