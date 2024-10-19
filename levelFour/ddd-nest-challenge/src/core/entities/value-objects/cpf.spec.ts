import { makeCPF } from 'test/factories/make-cpf'
import { CPF } from './cpf'

describe('Value Object: CPF', () => {
  it('should validate a valid CPF', () => {
    expect(CPF.isValidCPF('974.432.170-99')).toEqual(true)
    expect(CPF.isValidCPF(makeCPF())).toEqual(true)
  })

  it('should not validate a invalid CPF', () => {
    expect(CPF.isValidCPF('777.777.777-77')).toEqual(false)
    expect(CPF.isValidCPF('123.456.789-01')).toEqual(false)
    expect(CPF.isValidCPF('78.1.030-1')).toEqual(false)
  })

  it('should return a new CPF', () => {
    const text = '974.432.170-99'

    const cpf = CPF.createFromText(text)

    expect(cpf.value).toEqual('97443217099')
    expect(cpf.toDecorated()).toEqual(text)
  })
})
