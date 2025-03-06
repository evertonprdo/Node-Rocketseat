export function makeCEP() {
  const cepArray = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10),
  )

  const cepWithoutDecorations = cepArray.join('')

  if (/^(\d)\1{7}$/.test(cepWithoutDecorations)) {
    return makeCEP()
  }

  return cepWithoutDecorations
}
