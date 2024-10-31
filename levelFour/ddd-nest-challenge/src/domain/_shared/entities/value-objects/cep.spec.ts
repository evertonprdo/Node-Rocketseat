import { CEP } from './cep'

describe('Value Object: CEP', () => {
  it('should return a new CEP', () => {
    const cep = CEP.createFromText('19865-756')
    expect(cep).toBeInstanceOf(CEP)
  })

  it('should validated the CEP digits', () => {
    expect(CEP.isValidCEP('19865-756')).toEqual(true)
    expect(CEP.isValidCEP('123')).toEqual(false)
    expect(CEP.isValidCEP('11111111')).toEqual(false)
  })

  it('should return a decorated CEP', () => {
    const cep = CEP.createFromText('19865756')
    expect(cep.toDecorated()).toEqual('19865-756')
  })
})
