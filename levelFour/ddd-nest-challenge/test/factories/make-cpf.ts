export function makeCPF() {
  const baseDigits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10),
  )

  for (const weight of [10, 11]) {
    let sum = 0

    for (let multiplier = weight, i = 0; multiplier >= 2; multiplier--, i++) {
      sum += baseDigits[i] * multiplier
    }

    const rest = sum % 11
    const verifyDigit = rest < 2 ? 0 : 11 - rest

    baseDigits.push(verifyDigit)
  }

  return baseDigits.join('')
}
