import { CEP } from '../../domain/admin/entities/value-objects/cep'

export interface AddressProps {
  cep: CEP
  state: string
  city: string
  street: string
  number: string
  neighborhood: string
}
