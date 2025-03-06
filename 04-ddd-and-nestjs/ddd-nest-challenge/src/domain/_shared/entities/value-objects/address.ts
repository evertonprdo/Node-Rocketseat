import { CEP } from './cep'

export interface AddressProps {
  cep: CEP
  state: string
  city: string
  street: string
  number: string
  neighborhood: string
}

export class Address {
  public cep: CEP
  public state: string
  public city: string
  public street: string
  public number: string
  public neighborhood: string

  constructor({
    cep,
    state,
    city,
    street,
    number,
    neighborhood,
  }: AddressProps) {
    this.cep = cep
    this.state = this.normalizeString(state)
    this.city = this.normalizeString(city)
    this.street = this.normalizeString(street)
    this.number = this.normalizeString(number)
    this.neighborhood = this.normalizeString(neighborhood)
  }

  private normalizeString(value: string) {
    return value.toLowerCase().trim()
  }

  isCityEqual(city: string) {
    city = city.toLowerCase().trim()

    if (city === this.city) {
      return true
    }

    return false
  }
}
