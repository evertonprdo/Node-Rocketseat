import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  return shouldSuccess ? right(10) : left('error')
}

it('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
})

it('error result', () => {
  const result = left(false)

  expect(result.isRight()).toBe(false)
  expect(result.isLeft()).toBe(true)
})
