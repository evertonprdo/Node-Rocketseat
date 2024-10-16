export class CPF {
  private _value: string

  get value() {
    return this._value
  }

  private constructor(value: string) {
    this._value = value
  }

  static createFromText(text: string) {
    if (!this.isValidCPF(text)) {
      throw new Error('Invalid CPF')
    }

    const cpfWithoutDecorates = text.replace(/\D/g, '')

    return new CPF(cpfWithoutDecorates)
  }

  toDecorated() {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static isValidCPF(cpf: string): boolean {
    const cpfWithoutDecorates = cpf.replace(/\D/g, '')
    const calculationDigits = cpfWithoutDecorates.split('', 9)

    if (cpfWithoutDecorates.length !== 11) {
      return false
    }

    if (/^(\d)\1{10}$/.test(cpfWithoutDecorates)) {
      return false
    }

    let validatorDigit: string

    for (const digit of [9, 10]) {
      let soma = 0

      calculationDigits.forEach((value, i) => {
        const multiplier = i + (10 - digit)
        soma += Number(value) * multiplier
      })

      const rest = soma % 11

      validatorDigit = String(rest > 9 ? 0 : rest)

      if (cpfWithoutDecorates[digit] !== validatorDigit) {
        return false
      }

      calculationDigits.push(validatorDigit)
    }

    return true
  }
}
