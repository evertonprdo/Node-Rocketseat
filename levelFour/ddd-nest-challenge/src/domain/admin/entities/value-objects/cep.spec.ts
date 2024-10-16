import { CEP } from './cep'

describe('Value Object: CEP', () => {
  it('should return a new CEP', () => {
    const cep = CEP.createFromText('19865-756')
    expect(cep).toBeInstanceOf(CEP)
  })

  it('should throw a error if cep is invalid', () => {
    expect(() => CEP.createFromText('invalid-cep')).toThrow()
  })

  it('should validated the CEP digits', () => {
    expect(CEP.validateCEP('19865-756')).toEqual(true)
    expect(CEP.validateCEP('123')).toEqual(false)
    expect(CEP.validateCEP('11111111')).toEqual(false)
  })

  it('should return a decorated CEP', () => {
    const cep = CEP.createFromText('19865756')
    expect(cep.toDecorated()).toEqual('19865-756')
  })
})
