export class CEP {
  private _value: string

  get value() {
    return this._value
  }

  private constructor(value: string) {
    this._value = value
  }

  static createFromText(value: string) {
    const cepWithoutDecorations = value.replace(/\D/g, '')

    return new CEP(cepWithoutDecorations)
  }

  toDecorated() {
    return `${this.value.slice(0, 5)}-${this.value.slice(5)}`
  }

  static isValidCEP(value: string) {
    const cepWithoutDecorations = value.replace(/\D/g, '')

    if (cepWithoutDecorations.length !== 8) {
      return false
    }

    if (/^(\d)\1{7}$/.test(cepWithoutDecorations)) {
      return false
    }

    return true
  }
}
