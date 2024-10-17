export function makeCEP() {
  const cepArray = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  )

  return cepArray.join('')
}
