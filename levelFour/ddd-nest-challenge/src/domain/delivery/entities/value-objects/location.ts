export class Position {
  private _latitude: number
  private _longitude: number

  private constructor(latitude: number, longitude: number) {
    this._latitude = latitude
    this._longitude = longitude
  }

  isValidLocation(latitude: number, longitude: number) {
    if (isNaN(latitude) || isNaN(longitude)) {
      return false
    }

    if (Math.abs(latitude) > 90) {
      return false
    }

    if (Math.abs(longitude) > 180) {
      return false
    }

    return true
  }

  get latitude(): number {
    return this._latitude
  }

  get longitude(): number {
    return this._longitude
  }
}
