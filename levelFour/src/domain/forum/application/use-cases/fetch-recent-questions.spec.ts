import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    vi.setSystemTime(new Date(2022, 0, 20))
    await inMemoryQuestionsRepository.create(makeQuestion())

    vi.setSystemTime(new Date(2022, 0, 18))
    await inMemoryQuestionsRepository.create(makeQuestion())

    vi.setSystemTime(new Date(2022, 0, 23))
    await inMemoryQuestionsRepository.create(makeQuestion())

    const { question } = await sut.execute({
      page: 1,
    })

    expect(question).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    const createQuestionsPromises = Array.from({ length: 22 }).map(() =>
      inMemoryQuestionsRepository.create(makeQuestion()),
    )

    await Promise.all(createQuestionsPromises)

    const { question } = await sut.execute({
      page: 2,
    })

    expect(question).toHaveLength(2)
  })
})
